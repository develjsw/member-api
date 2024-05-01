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
            member: {
                address: 'http://localhost:8001',
                endpoint: {
                    v1: {
                        signup: '/api/v1/members/signup',
                        login: '/api/v1/members/login'
                    }
                }
            }
        },
        out: {}
    }
});
