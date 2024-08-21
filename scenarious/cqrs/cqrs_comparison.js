import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const mysqlTrend = new Trend('mysql_duration', true);
const nosqlTrend = new Trend('nosql_duration', true);
const esTrend = new Trend('es_duration', true);

const testDuration = '10m';
//const testDuration = '10s';
const readUsers = 50;
const writeUsers = 2;
const addUsers = 1;

export let options = {
    scenarios: {
        write_operations: {
            exec: 'simulateEditing',
            executor: 'constant-vus',
            vus: writeUsers, // 2 users for write operations
            duration: testDuration,
        },
        add_operations: {
            exec: 'simulateAdding',
            executor: 'constant-vus',
            vus: addUsers, // 1 user for add operations
            duration: testDuration,
        },
        read_operations_mysql: {
            exec: 'simulateAccessMysql',
            executor: 'constant-vus',
            vus: readUsers, // 50 users for read operations
            duration: testDuration,
        },
        read_operations_nosql: {
            exec: 'simulateAccessNosql',
            executor: 'constant-vus',
            vus: readUsers, // 50 users for read operations
            duration: testDuration,
        },
        read_operations_es: {
            exec: 'simulateSearch',
            executor: 'constant-vus',
            vus: readUsers, // 50 users for search operations
            duration: testDuration,
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should complete within 500ms
    },
};

function simulateEditing() {
    const payload = JSON.stringify({
        name: "Updated product 3",
        description: "Updated Description..",
        price: 19.99,
        quantity: 100,
        active: true,
        brandId: 3
    });

    const response = http.put('http://localhost:8091/admin/products/3', payload, {
        headers: { 'Content-Type': 'application/json' }
    });
    check(response, { 'Write status was 200': (r) => r.status === 200 });
    return response.timings.duration;
}

function simulateAdding() {
    const payload = JSON.stringify({
        name: "New product",
        description: "New Description",
        price: 19.99,
        quantity: 100,
        active: true,
        categoryId: 2,
        brandId: 3
    });

    const response = http.post('http://localhost:8091/admin/products', payload, {
        headers: { 'Content-Type': 'application/json' }
    });
    check(response, { 'Write status was 201': (r) => r.status === 201 });
    return response.timings.duration;
}

function simulateAccessMysql() {
    const response = http.get('http://localhost:8191/api/products');
    check(response, { 'Read status was 200': (r) => r.status === 200 });
    mysqlTrend.add(response.timings.duration);
}

function simulateAccessNosql() {
    const response = http.get('http://localhost:8192/api/products');
    check(response, { 'Read status was 200': (r) => r.status === 200 });
    nosqlTrend.add(response.timings.duration);
}

function simulateSearch() {
    const response = http.get('http://localhost:8193/products/search?q=prod');
    check(response, { 'Read status was 200': (r) => r.status === 200 });
    esTrend.add(response.timings.duration);
}

export { simulateEditing, simulateAdding, simulateAccessMysql, simulateAccessNosql, simulateSearch }
export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        // 'results/summary.json': JSON.stringify(data),
        // 'results/trends.json': JSON.stringify({
        //     mysql_service: mysqlTrend,
        //     nosql_service: nosqlTrend,
        //     es_service: esTrend
        // }),
    };
}