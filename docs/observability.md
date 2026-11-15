# Monitoring, Observability and Scalability

STRNG exposes `GET /api/metrics` in Prometheus text format. The backend records total requests and request duration by HTTP method, route and status code. `prom-client` also collects default Node.js process metrics, including memory and event-loop information.

Prometheus can scrape the endpoint with a configuration similar to:

```yaml
scrape_configs:
  - job_name: strng-api
    metrics_path: /api/metrics
    static_configs:
      - targets: ['backend:3001']
```

Grafana can use Prometheus as a data source to display request rate, latency percentiles, status-code distribution and process health. Logs explain individual events, metrics show trends and traces would be used to follow a request across multiple services. The current project implements metrics and health checks; centralized logs and distributed traces remain natural extensions.

The architecture supports horizontal scaling because the React client and Express API are separated and application state is stored in MongoDB rather than in process memory. Additional API instances can therefore receive traffic behind a load balancer, while MongoDB Atlas provides managed database capacity. Scaling decisions should be based on latency, error rate, request volume and resource consumption rather than on arbitrary replica counts.
