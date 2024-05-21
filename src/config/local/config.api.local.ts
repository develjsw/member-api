export default () => ({
    apis: {
        in: {
            redis: {
                address: 'http://host.docker.internal:9001',
                endpoint: {
                    v1: {
                        get: '/api/v1/redis/:key',
                        set: '/api/v1/redis',
                        del: '/api/v1/redis/:key'
                    }
                }
            },
            jwt: {
                address: 'http://localhost:8004',
                endpoint: {
                    v1: {
                        create: '/api/v1/jwt',
                        detail: '/api/v1/jwt'
                    }
                }
            }
        },
        out: {}
    }
});
