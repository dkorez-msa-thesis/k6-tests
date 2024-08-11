import http from 'k6/http';
import { check } from 'k6';

const serviceUrl = 'http://localhost:8091/admin/';

export function testAdmin() {
  group('BRANDS', function() {
    // CREATE
    const createPayload = { name: 'brand', description: 'brand description' };
    const createRes = http.post(`${serviceUrl}/brands`, JSON.stringify(createPayload));
    check(createRes, { 'status is 201': (r) => r.status === 201 });
    const itemId = createRes.json('id');

    // READ
    const readRes = http.get(`${serviceUrl}/brands/${itemId}`);
    check(readRes, { 'status is 200': (r) => r.status === 200 });

    // UPDATE
    const updatePayload = { description: 'updated brand' };
    const updateRes = http.put(`${serviceUrl}/brands/${itemId}`, JSON.stringify(updatePayload));
    check(updateRes, { 'status is 200': (r) => r.status === 200 });

    // DELETE
    const deleteRes = http.del(`${serviceUrl}/brands/${itemId}`);
    check(deleteRes, { 'status is 204': (r) => r.status === 204 });
  });

  group('CATEGORIES', function() {
    // CREATE
    const createPayload = { name: 'new category', description: 'category description' };
    const createRes = http.post(`${serviceUrl}/categories`, JSON.stringify(createPayload));
    check(createRes, { 'status is 201': (r) => r.status === 201 });
    const itemId = createRes.json('id');

    // READ
    const readRes = http.get(`${serviceUrl}/categories/${itemId}`);
    check(readRes, { 'status is 200': (r) => r.status === 200 });

    // UPDATE
    const updatePayload = { description: 'updated category' };
    const updateRes = http.put(`${serviceUrl}/categories/${itemId}`, JSON.stringify(updatePayload));
    check(updateRes, { 'status is 200': (r) => r.status === 200 });

    // DELETE
    const deleteRes = http.del(`${serviceUrl}/categories/${itemId}`);
    check(deleteRes, { 'status is 204': (r) => r.status === 204 });
  });

  group('SPECIFICATIONS', function() {
    // CREATE
    const createPayload = { name: 'color', value: 'blue' };
    const createRes = http.post(`${serviceUrl}/specification`, JSON.stringify(createPayload));
    check(createRes, { 'status is 201': (r) => r.status === 201 });
    const itemId = createRes.json('id');

    // READ
    const readRes = http.get(`${serviceUrl}/specification/${itemId}`);
    check(readRes, { 'status is 200': (r) => r.status === 200 });

    // UPDATE
    const updatePayload = { value: 'red' };
    const updateRes = http.put(`${serviceUrl}/specification/${itemId}`, JSON.stringify(updatePayload));
    check(updateRes, { 'status is 200': (r) => r.status === 200 });

    // DELETE
    const deleteRes = http.del(`${serviceUrl}/specification/${itemId}`);
    check(deleteRes, { 'status is 204': (r) => r.status === 204 });
  });

  group('TAGS', function() {
    // CREATE
    const createPayload = { name: 'tag' };
    const createRes = http.post(`${serviceUrl}/tags`, JSON.stringify(createPayload));
    check(createRes, { 'status is 201': (r) => r.status === 201 });
    const itemId = createRes.json('id');

    // READ
    const readRes = http.get(`${serviceUrl}/tags/${itemId}`);
    check(readRes, { 'status is 200': (r) => r.status === 200 });

    // UPDATE
    const updatePayload = { name: 'updated' };
    const updateRes = http.put(`${serviceUrl}/tags/${itemId}`, JSON.stringify(updatePayload));
    check(updateRes, { 'status is 200': (r) => r.status === 200 });

    // DELETE
    const deleteRes = http.del(`${serviceUrl}/tags/${itemId}`);
    check(deleteRes, { 'status is 204': (r) => r.status === 204 });
  });

  group('PRODUCTS', function() {
    // CREATE
    const createPayload = { name: 'new item', description: 'new item description', price: 12.34, quantity: 12, active: true };
    const createRes = http.post(`${serviceUrl}/products`, JSON.stringify(createPayload));
    check(createRes, { 'status is 201': (r) => r.status === 201 });
    const itemId = createRes.json('id');

    // READ
    const readRes = http.get(`${serviceUrl}/products/${itemId}`);
    check(readRes, { 'status is 200': (r) => r.status === 200 });

    // UPDATE
    const updatePayload = { description: 'updated item', price: 19.99, quantity: 8 };
    const updateRes = http.put(`${serviceUrl}/products/${itemId}`, JSON.stringify(updatePayload));
    check(updateRes, { 'status is 200': (r) => r.status === 200 });

    // DELETE
    const deleteRes = http.del(`${serviceUrl}/products/${itemId}`);
    check(deleteRes, { 'status is 204': (r) => r.status === 204 });
  });
}