import http from 'k6/http';
import { check } from 'k6';

// export const adminServiceRest = {
//     baseUrlRest: 'http://localhost:8091/admin',
//     endpoints: [
//         { name: 'createProduct', method: 'POST', endpoint: '/products', payload: { name: 'New Product', price: 9.99 } },
//         { name: 'updateProduct', method: 'PUT', endpoint: '/products/1', payload: { name: 'Updated Product', price: 19.99 } }
//     ]
// };

export const adminServiceRest = {
    baseUrlRest: 'http://localhost:8091/admin',
    endpoints: [
        { name: 'updateProduct', method: 'PUT', endpoint: '/products/3', payload: { name: 'Updated product 3', description: 'Updated Description..', price: 19.99, quantity: 100, active: true, brandId: 3 } },
        { name: 'updateProduct', method: 'PUT', endpoint: '/products/2', payload: { name: 'P2', description: 'Product #2', price: 24.99, quantity: 30, active: true } },
    ]
};

export function testRestEndpoint(service) {
    const endpoints = service.endpoints;

    endpoints.forEach(({ name, method, endpoint, payload }) => {
        let response;
        switch (method) {
            case 'GET':
                response = http.get(service.baseUrlRest + endpoint);
                break;
            case 'POST':
                response = http.post(service.baseUrlRest + endpoint, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
                break;
            case 'PUT':
                response = http.put(service.baseUrlRest + endpoint, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
                break;
            case 'DELETE':
                response = http.del(service.baseUrlRest + endpoint);
                break;
        }
        check(response, {
            [`REST ${method} ${service.baseUrlRest}${endpoint}: status 200`]: (r) => r.status === 200
        });
    });
}
