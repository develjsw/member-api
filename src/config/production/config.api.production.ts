export default () => ({
    apis: {
        in: {
            redis: {
                address: '',
                endpoint: {
                    v1: {
                        get: '/api/v1/redis/:key',
                        set: '/api/v1/redis'
                    }
                }
            },
            member: {
                address: '',
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
