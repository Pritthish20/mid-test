export const validateBody = (schema) => async(req, res, next) => {
  const d = schema.safeParse(req.body);
  if (!d.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }
  req.body = d.data;
  next();
};

export const validateParams = (schema) => async(req, res, next) => {
  const d = schema.safeParse(req.body);
  if (!d.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }
  req.params = d.data;
  next();
};

export const validateQuery = (schema) => async(req, res, next) => {
  const d = schema.safeParse(req.body);
  if (!d.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }
  req.query = d.data;
  next();
};
