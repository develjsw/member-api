export default () => ({
    apis: {
        in: {
            redis: {
                //address: 'http://localhost:9001',
                //address: 'http://192.168.208.2:9001',
                address: 'http://host.docker.internal:9001',
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
