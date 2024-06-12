export default () => ({
    apis: {
        in: {
            redis: {
                address: '',
                url: {
                    v1: {
                        get: '/api/v1/redis/:key',
                        set: '/api/v1/redis',
                        del: '/api/v1/redis/:key'
                    }
                }
            }
        },
        out: {}
    }
});
