import { sleep } from 'k6';
import { executeSingleQuery } from './protocol_helpers.js';
import { getAllProductsQuery } from './utils/queries.js';

const serviceUrl = 'http://localhost:8191/graphql';

export let options = {
    scenarios: {
        rest_test: {
            executor: 'constant-vus',
            vus: 10,
            duration: '5s',
            exec: 'simulateGraphQl',
        },
    },
};

export function simulateGraphQl() {
    const duration = executeSingleQuery(serviceUrl, getAllProductsQuery);
    console.log(`GraphQL request duration: ${duration}ms`);
    sleep(1);
}
