export default () => ({
    apis: {
        in: {
            redis: {
                address: 'http://localhost:9001',
                endpoint: {
                    v1: {
                        get: '/api/v1/redis/:key',
                        set: '/api/v1/redis'
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
