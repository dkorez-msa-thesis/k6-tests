import { sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { executeRest, executeSingleMethodGrpc, executeSingleQuery } from './protocol_helpers.js';
import { getAllProductsQuery, getAllProductsBaseDataQuery } from './utils/queries.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const restTrend = new Trend('rest_duration', true);
const grpcTrend = new Trend('grpc_duration', true);
const graphqlTrend = new Trend('graphql_duration', true);
const graphqlPartialTrend = new Trend('graphql_partial_duration', true);

const simVus = 100;
const simDuration = '10m';
//const simDuration = '10s';

export let options = {
    scenarios: {
        rest_test: {
            executor: 'constant-vus',
            vus: simVus,
            duration: simDuration,
            exec: 'simulateRest',
        },
        grpc_test: {
            executor: 'constant-vus',
            vus: simVus,
            duration: simDuration,
            exec: 'simulateGrpc',
        },
        graphql_test: {
            executor: 'constant-vus',
            vus: simVus,
            duration: simDuration,
            exec: 'simulateGraphql',
        },
        graphql_partial_test: {
            executor: 'constant-vus',
            vus: simVus,
            duration: simDuration,
            exec: 'simulateGraphqlPartial',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'],
        'rest_duration{scenario:rest_test}': ['p(95)<500'],
        'grpc_duration{scenario:grpc_test_plain}': ['p(95)<500'],
        'graphql_duration{scenario:graphql_test}': ['p(95)<500'],
        'graphql_partial_duration{scenario:graphql_partial_test}': ['p(95)<500'],
    },
};

function simulateRest() {
    const serviceUrl = 'http://localhost:8192/api';
    const endpoint = '/products';
    const duration = executeRest(serviceUrl, endpoint);
    restTrend.add(duration);
    console.log(`REST request duration: ${duration}ms`);
    sleep(1);
}

function simulateGraphql() {
    const serviceUrl = 'http://localhost:8192/graphql';
    const duration = executeSingleQuery(serviceUrl, getAllProductsQuery);
    graphqlTrend.add(duration);
    console.log(`GraphQL request duration: ${duration}ms`);
    sleep(1);
}

function simulateGraphqlPartial() {
    const serviceUrl = 'http://localhost:8192/graphql';
    const duration = executeSingleQuery(serviceUrl, getAllProductsBaseDataQuery);
    graphqlPartialTrend.add(duration);
    console.log(`GraphQL partial request duration: ${duration}ms`);
    sleep(1);
}

function simulateGrpc() {
    const serviceUrl = 'localhost:9092';
    const grpcMethod = { method: 'catalog.ProductServiceGrpc/ListAllProducts', payload: {} };
    const duration = executeSingleMethodGrpc(serviceUrl, grpcMethod);
    grpcTrend.add(duration);
    console.log(`gRPC request duration: ${duration}ms`);
    sleep(1);
}

export { simulateRest, simulateGrpc, simulateGraphql, simulateGraphqlPartial };

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        // './results/comparison-summary.json': JSON.stringify(data),
        // './results/comparison-trends.json': JSON.stringify({
        //     rest: restTrend,
        //     grpc_binary: grpcTrendBinary,
        //     grpc_plain: grpcTrendPlain,
        //     graphql: graphqlTrend,
        //     graphql_partial: graphqlPartialTrend
        // }),
    };
}
