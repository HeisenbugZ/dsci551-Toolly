module.exports = {
  apis: {
    output: {
      mode: 'tags-split',
      target: 'src/.apis/index.ts',
      schemas: 'src/.apis/model',
      client: 'react-query',
      mock: false,
    },
    input: {
      target: './apis.yaml',
    },
  },
};