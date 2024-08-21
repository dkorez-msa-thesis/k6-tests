import http from 'k6/http';
import grpc from 'k6/net/grpc';
import { check } from 'k6';

const grpcClient = new grpc.Client();
grpcClient.load([], './utils/product.proto');

export function executeRest(baseUrl, endpoint) {
    const response = http.get(`${baseUrl}${endpoint}`);
    check(response, { [`REST ${baseUrl}${endpoint}: status 200`]: (r) => r.status === 200 });

    return response.timings.duration;
}

export function executeSingleMethodGrpc(serviceUrl, grpcMethod) {
    grpcClient.connect(serviceUrl, { plaintext: true });
    const { method, payload } = grpcMethod;

    const startTime = Date.now();
    const response = grpcClient.invoke(method, payload);
    const duration = Date.now() - startTime;
    check(response, {
        [`gRPC ${method} status 200`]: (r) => r && r.status === grpc.StatusOK,
    });
    grpcClient.close();

    return duration;
}

export function executeSingleQuery(serviceUrl, query) {
    const response = http.post(serviceUrl, JSON.stringify({ query }), {
        headers: { 'Content-Type': 'application/json' },
    });

    check(response, {
        [`GraphQL ${serviceUrl} status was 200`]: (r) => r.status === 200,
        [`GraphQL ${serviceUrl} response has data`]: (r) => JSON.parse(r.body).data !== undefined,
    });
    return response.timings.duration;
}
