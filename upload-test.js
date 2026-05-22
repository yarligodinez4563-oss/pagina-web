const https = require('https');
const http = require('http');

const API = process.env.API_URL || 'https://pagina-web-sp9h.onrender.com';
const url = new URL(API);

function request(method, path, headers, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: url.hostname,
      path,
      method,
      headers
    };
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(opts, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const login = await request('POST', '/api/auth/login', { 'Content-Type': 'application/json' },
    JSON.stringify({ email: 'admin@biblioteca.com', password: 'Admin123!' }));
  console.log('Login:', login.status);
  const token = login.data.token;

  const pdfContent = Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\ntrailer<</Size 4/Root 1 0 R>>\n%%EOF\n'
  );

  function part(name, value, filename) {
    let header = `--boundary123\r\nContent-Disposition: form-data; name="${name}"`;
    if (filename) header += `; filename="${filename}"\r\nContent-Type: application/pdf`;
    header += '\r\n\r\n';
    return Buffer.concat([
      Buffer.from(header, 'utf-8'),
      Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf-8'),
      Buffer.from('\r\n', 'utf-8')
    ]);
  }

  async function createBook(title, author, desc, cat, hasPdf) {
    const body = Buffer.concat([
      part('title', title),
      part('author', author),
      part('description', desc),
      part('category', cat),
      ...(hasPdf ? [part('file', pdfContent, 'libro.pdf')] : []),
      Buffer.from('--boundary123--\r\n', 'utf-8')
    ]);
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data; boundary=boundary123',
      'Content-Length': body.length
    };
    const r = await request('POST', '/api/books', headers, body);
    console.log(`  ${r.status} - ${title} ${hasPdf ? '📄' : ''}`);
  }

  console.log('Subiendo libros:');
  await createBook('El Principito (con PDF)', 'Antoine de Saint-Exupéry', 'Clásico de la literatura infantil', 'Literatura infantil', true);
  await createBook('1984', 'George Orwell', 'Distopía totalitaria', 'Ciencia ficción', false);
  await createBook('Don Quijote', 'Miguel de Cervantes', 'Aventuras del ingenioso hidalgo', 'Clásicos', false);
  await createBook('Crimen y Castigo', 'Fiódor Dostoyevski', 'Novela psicológica', 'Novela', false);
  console.log('¡Listo!');
}

main().catch(console.error);
