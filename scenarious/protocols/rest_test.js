import { sleep } from 'k6';
import { executeRest } from './protocol_helpers.js';

const serviceUrl = 'http://localhost:8191/api';
const endpoint = '/products';

export let options = {
    scenarios: {
        rest_test: {
            executor: 'constant-vus',
            vus: 10,
            duration: '5s',
            exec: 'simulateRest',
        },
    },
};

export function simulateRest() {
    const duration = executeRest(serviceUrl, endpoint);
    console.log(`REST request duration: ${duration}ms`);
    sleep(1);
}