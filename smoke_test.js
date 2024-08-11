import { testAdmin } from './smoketests/admin_service.js';

export default function () {
    group('ADMIN SERVICE', function () {
        testAdmin();
    });
}
