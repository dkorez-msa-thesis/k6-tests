import { sleep } from 'k6';
import { executeSingleMethodGrpc } from './protocol_helpers.js';

const serviceUrl = 'localhost:9091';
const grpcMethod = { method: 'catalog.ProductServiceGrpc/ListAllProducts', payload: {} };

export let options = {
    scenarios: {
        rest_test: {
            executor: 'constant-vus',
            vus: 10,
            duration: '1m',
            exec: 'simulateGrpc',
        },
    },
};

export function simulateGrpc() {
    const duration = executeSingleMethodGrpc(serviceUrl, grpcMethod);
    console.log(`gRPC request duration: ${duration}ms`);
    sleep(1);
}