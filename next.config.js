module.exports = {
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'POST' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
          ]
        }
      ];
    }
  };