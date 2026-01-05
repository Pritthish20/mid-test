// ws/wsInit.js
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";

import User from "../models/user.model.js";
import Class from "../models/class.model.js";
import Attendance from "../models/attendance.model.js";

import {
  getActiveSession,
  startSession,
  stopSession,
  markAttendance,
  computeSummary,
  NO_ACTIVE_SESSION_MSG,
} from "../utils/globaState.js";

import { env } from "../configs/envSchema.js";
import { sendError, sendEvent, broadcast, safeJsonParse } from "./wsHelper.js";

const UNAUTH_WS_MSG = "Unauthorized or invalid token";
const INVALID_MSG = "Invalid message format";
const UNKNOWN_EVENT = "Unknown event";
const TEACHER_ONLY = "Forbidden, teacher event only";
const STUDENT_ONLY = "Forbidden, student event only";

const getTokenFromUrl = (reqUrl) => {
  const url = new URL(reqUrl, "http://localhost");
  return url.searchParams.get("token");
};

export const initWs = (server) => {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", async (ws, req) => {
    const token = getTokenFromUrl(req.url);

    // token missing
    if (!token) {
      sendError(ws, UNAUTH_WS_MSG);
      return ws.close();
    }

    // token invalid
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch {
      sendError(ws, UNAUTH_WS_MSG);
      return ws.close();
    }

    const userId = decoded?.userId || decoded?._id || decoded?.id;
    if (!userId) {
      sendError(ws, UNAUTH_WS_MSG);
      return ws.close();
    }

    // verify user exists
    const user = await User.findById(userId).select("role");
    if (!user) {
      sendError(ws, UNAUTH_WS_MSG);
      return ws.close();
    }

    ws.user = { userId: user._id.toString(), role: user.role };

    ws.on("message", async (raw) => {
      const msg = safeJsonParse(raw.toString());

      // invalid JSON or invalid shape
      if (!msg || typeof msg.event !== "string") {
        return sendError(ws, INVALID_MSG);
      }

      // data must be object when present
      if (msg.data != null && typeof msg.data !== "object") {
        return sendError(ws, INVALID_MSG);
      }

      try {
        switch (msg.event) {
          case "ATTENDANCE_MARKED": {
            if (ws.user.role !== "teacher") return sendError(ws, TEACHER_ONLY);

            const session = getActiveSession();
            if (!session) return sendError(ws, NO_ACTIVE_SESSION_MSG);

            const { studentId, status } = msg.data || {};
            if (!studentId || !["present", "absent"].includes(status)) {
              return sendError(ws, INVALID_MSG);
            }

            markAttendance(studentId, status);
            return broadcast(wss, "ATTENDANCE_MARKED", { studentId, status });
          }

          case "TODAY_SUMMARY": {
            if (ws.user.role !== "teacher") return sendError(ws, TEACHER_ONLY);

            const session = getActiveSession();
            if (!session) return sendError(ws, NO_ACTIVE_SESSION_MSG);

            const summary = computeSummary(); // {present, absent, total}
            return broadcast(wss, "TODAY_SUMMARY", summary);
          }

          case "MY_ATTENDANCE": {
            if (ws.user.role !== "student") return sendError(ws, STUDENT_ONLY);

            const session = getActiveSession();
            if (!session) return sendError(ws, NO_ACTIVE_SESSION_MSG);

            const status = session.attendance[String(ws.user.userId)];
            return sendEvent(ws, "MY_ATTENDANCE", { status: status ?? "not yet updated" });
          }

          case "DONE": {
            if (ws.user.role !== "teacher") return sendError(ws, TEACHER_ONLY);

            const session = getActiveSession();
            if (!session) return sendError(ws, NO_ACTIVE_SESSION_MSG);

            // load class & validate ownership
            const cls = await Class.findById(session.classId).lean();
            if (!cls) {
              // tests don't specify WS error for this, but keep consistent and safe
              return sendError(ws, "Class not found");
            }

            if (String(cls.teacherId) !== String(ws.user.userId)) {
              return sendError(ws, "Forbidden, not class teacher");
            }

            // mark absent for unmarked enrolled students
            const studentIds = (cls.studentIds || []).map(String);
            for (const sid of studentIds) {
              if (!session.attendance[sid]) session.attendance[sid] = "absent";
            }

            // persist attendance (upsert per student)
            const ops = studentIds.map((sid) => ({
              updateOne: {
                filter: { classId: String(session.classId), studentId: String(sid) },
                update: {
                  $set: {
                    classId: String(session.classId),
                    studentId: String(sid),
                    status: session.attendance[sid],
                  },
                },
                upsert: true,
              },
            }));
            if (ops.length) await Attendance.bulkWrite(ops);

            // final counts (now total = class size)
            const values = Object.values(session.attendance);
            const present = values.filter((s) => s === "present").length;
            const absent = values.filter((s) => s === "absent").length;
            const total = studentIds.length;

            // IMPORTANT: stop session so later events error "No active attendance session"
            stopSession();

            return broadcast(wss, "DONE", {
              message: "Attendance persisted",
              present,
              absent,
              total,
            });
          }

          default:
            return sendError(ws, UNKNOWN_EVENT);
        }
      } catch {
        // keep strict error format
        return sendError(ws, "Internal server error");
      }
    });

    ws.on("close", () => {
      // no-op; global session continues independent of connections
    });
  });

  return wss;
};
