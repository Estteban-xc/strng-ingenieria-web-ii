const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'strng_' });

const httpRequestsTotal = new client.Counter({
  name: 'strng_http_requests_total',
  help: 'Total number of HTTP requests handled by STRNG.',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'strng_http_request_duration_seconds',
  help: 'HTTP request duration in seconds.',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register]
});

function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const route = req.route?.path || req.baseUrl || req.path || 'unknown';
    const labels = { method: req.method, route: String(route), status_code: String(res.statusCode) };
    const elapsed = Number(process.hrtime.bigint() - start) / 1e9;
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, elapsed);
  });
  next();
}

module.exports = { metricsMiddleware, register };
