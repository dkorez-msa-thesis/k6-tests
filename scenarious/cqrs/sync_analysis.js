import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const writeTrend = new Trend('write_duration', true);
const mysqlTrend = new Trend('mysql_duration', true);
const nosqlTrend = new Trend('nosql_duration', true);
const writeCounter = new Counter('write_requests');
const mysqlCounter = new Counter('mysql_requests');
const nosqlCounter = new Counter('nosql_requests');

const testDuration = '5s';
const users = 50;
const products = 10;

const priceList = [29.99, 29.99, 35.99, 19.49, 24.99, 15.49, 4.99, 34.99, 29.99, 17.49, 27.45];
const quantityList = [130, 63, 85, 135, 35, 38, 42, 125, 112, 55, 46];

export let options = {
    scenarios: {
        write_operations: {
            exec: 'simulateEditing',
            executor: 'constant-vus',
            vus: users,
            duration: testDuration,
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should complete within 500ms
    },
};

function simulateEditingSingle(productId, quantity, price) {
    const payload = JSON.stringify({
        name: "Updated product",
        description: "Updated Description",
        price: price,
        quantity: quantity,
        active: true,
        brandId: 3
    });

    const response = http.put(`http://localhost:8091/admin/products/${productId}`, payload, {
        headers: { 'Content-Type': 'application/json' }
    });
    check(response, { 'Write status was 200': (r) => r.status === 200 });

    writeTrend.add(response.timings.duration);
    writeCounter.add(1);
}

function simulateEditing() {
    for (let i = 1; i <= products; i++) {
        let quantity = quantityList[i-1];
        let price = priceList[i-1];

        simulateEditingSingle(i, quantity, price);
        simulateAccessMysql(i, quantity, price);
        simulateAccessNosql(i, quantity, price);
        sleep(1);
    }
}

function simulateAccessMysql(productId, quantity, price) {
    const response = http.get(`http://localhost:8191/api/products/${productId}`);
    check(response, { 'Read status was 200': (r) => r.status === 200 });

    mysqlTrend.add(response.timings.duration);
    mysqlCounter.add(1);

    const product = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
    check(product, {
        'MySql podatki se ujemajo s pričakovanimi': (p) => p.price === price && p.quantity === quantity,
    });
}

function simulateAccessNosql(productId, quantity, price) {
    const response = http.get(`http://localhost:8192/api/products/${productId}`);
    check(response, { 'Read status was 200': (r) => r.status === 200 });

    nosqlTrend.add(response.timings.duration);
    nosqlCounter.add(1);

    const product = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
    check(product, {
        'Mongo podatki se ujemajo s pričakovanimi': (p) => p.price === price && p.quantity === quantity,
    });
}

export { simulateEditing }
export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true })
    };
}
