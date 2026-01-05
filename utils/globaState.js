let activeSession = null;

export const getActiveSession = () => activeSession;

export const isAcitveSession = () => !!activeSession;

export const startSession = (classId) => {
  activeSession = {
    classId: classId,
    startedAt: new Date().toISOString(),
    attendance: {},
  };
  return activeSession;
};

export const stopSession = () => {
  activeSession = null;
};

// export const checkActiveSession = ()=>{
//     if(!activeSession){
//         return {
//             success:false,
//             error : `No active attendance session`
//         }
//     }
//     return activeSession;
// }

// export const markAttendence=(sId,status)=>{
//     const session= checkActiveSession();
//     session.attendance[sId]=status;
//     return session;
// }

// export const computeSummary = ()=>{
//     const session= checkActiveSession();
//     const values =Object.values(session.attendance);
//     const present =values.filter((s)=>s==="present").length;
//     const absent =values.filter((s)=>s==="absent").length;
//     return {
//         present:present,
//         absent: absent,
//         total: present+absent,
//     }
// }

export const markAttendance = (studentId, status) => {
  if (!activeSession) return null;
  activeSession.attendance[String(studentId)] = status;
  return activeSession;
};

export const computeSummary = () => {
  if (!activeSession) return null;
  const values = Object.values(activeSession.attendance);
  const present = values.filter((s) => s === "present").length;
  const absent = values.filter((s) => s === "absent").length;
  return { present, absent, total: present + absent };
};


export const NO_ACTIVE_SESSION_MSG = "No active attendance session";