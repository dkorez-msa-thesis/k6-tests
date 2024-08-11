import { sleep } from 'k6';
import { executeSingleQuery } from './protocol_helpers.js';
import { getAllProductsBaseDataQuery } from './utils/queries.js';

const serviceUrl = 'http://localhost:8191/graphql';

export let options = {
    scenarios: {
        rest_test: {
            executor: 'constant-vus',
            vus: 10,
            duration: '5s',
            exec: 'simulateGraphQlPartial',
        },
    },
};

export function simulateGraphQlPartial() {
    const duration = executeSingleQuery(serviceUrl, getAllProductsBaseDataQuery);
    console.log(`GraphQL partial request duration: ${duration}ms`);
    sleep(1);
}
