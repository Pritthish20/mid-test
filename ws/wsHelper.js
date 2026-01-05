export const sendEvent = (ws, event, data = {}) => {
  if (ws.readyState !== ws.OPEN) return;
  ws.send(JSON.stringify({ event, data })); //why stringify
};

export const sendError = (ws, message) => {
  sendEvent(ws, "ERROR", { message });
};

export const broadcast = (wss, event, data = {}) => {
  const payload = JSON.stringify({ event, data });
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) client.send(payload);
  });
};

export const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};
