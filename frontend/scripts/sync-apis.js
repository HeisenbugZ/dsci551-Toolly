const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  const url = 'http://localhost:3123/swagger-yaml';
  const response = await fetch(url);

  const text = await response.text();

  fs.writeFileSync('apis.yaml', text);
})();


