const forbiddenKey = key => key.startsWith('$') || key.includes('.');
function assertSafeObject(value, path = 'body') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKey(key)) {
      const error = new Error(`Campo no permitido en ${path}: ${key}`);
      error.status = 400;
      throw error;
    }
    assertSafeObject(child, `${path}.${key}`);
  }
}
function rejectUnsafeKeys(req, res, next) {
  try { assertSafeObject(req.body); next(); }
  catch (err) { res.status(err.status || 400).json({ ok: false, error: 'Entrada inválida.' }); }
}
module.exports = { rejectUnsafeKeys };
