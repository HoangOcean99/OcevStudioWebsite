const http = require('http');

http.get('http://localhost:8000/api/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Total returned:', parsed.items?.length);
      if (parsed.items && parsed.items.length > 0) {
        parsed.items.slice(0, 3).forEach(p => console.log(p.name, '=>', p.category));
      } else {
        console.log(parsed);
      }
    } catch (e) {
      console.log('Response:', data);
    }
  });
}).on('error', err => {
  console.log('Error:', err.message);
});
