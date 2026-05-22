const https = require('https');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const API = 'https://pagina-web-sp9h.onrender.com';

const books = [
  {
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes Saavedra',
    category: 'Clásicos',
    description: 'El ingenioso hidalgo don Quijote de la Mancha es la obra cumbre de la literatura española. Publicada en dos partes (1605 y 1615), narra las aventuras de Alonso Quijano, un hidalgo que pierde la razón por leer demasiados libros de caballerías y decide salir en busca de aventuras.',
    filename: 'don-quijote.pdf',
    content: [
      'CAPÍTULO PRIMERO: Que trata de la condición y ejercicio del famoso hidalgo don Quijote de la Mancha',
      'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.',
      'Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.',
      'El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino.',
      'Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza que así ensillaba el rocín como tomaba la podadera.',
      'Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza.',
      'Quieren decir que tenía el sobrenombre de Quijada o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quejana.',
      'Pero esto importa poco a nuestro cuento; basta que en la narración dél no se salga un punto de la verdad.',
      'Es, pues, de saber que este sobredicho hidalgo, los ratos que estaba ocioso —que eran los más del año—, se daba a leer libros de caballerías, con tanta afición y gusto que olvidó casi de todo punto el ejercicio de la caza y aun la administración de su hacienda.',
      'Y llegó a tanto su curiosidad y desatino en esto que vendió muchas hanegas de tierra de sembradura para comprar libros de caballerías en que leer, y así, llevó a su casa todos cuantos pudo haber dellos.',
      'Finalmente, encerrado en su lectura, llegó a tal extremo que pasaba las noches leyendo de claro en claro y los días de turbio en turbio, y así, del poco dormir y del mucho leer se le secó el celebro de manera que vino a perder el juicio.',
      'Llenósele la fantasía de todo aquello que leía en los libros, así de encantamentos como de batallas, desafíos, heridas, requiebros, amores, tormentas y disparates imposibles.',
      'Y asentósele de tal modo en la imaginación que era verdad toda aquella máquina de aquellas soñadas invenciones que leía, que para él no había otra historia más cierta en el mundo.',
      'En efecto, rematado ya su juicio, vino a dar en el más extraño pensamiento que jamás dio loco en el mundo, y fue que le pareció convenible y necesario, así para el aumento de su honra como para el servicio de su república, hacerse caballero andante y irse por todo el mundo con sus armas y caballo a buscar aventuras.',
      'Y lo primero que hizo fue limpiar las armas que habían sido de sus bisabuelos, que, tomadas de orín y llenas de moho, luengos siglos había que estaban puestas y olvidadas en un rincón.',
      'Limpiólas y aderezólas lo mejor que pudo, pero vio que tenían una gran falta: que no tenían celada de encaje sino morrión simple. Mas a esto suplió su industria, porque de cartones hizo un modo de media celada que, encajada con el morrión, hacía una apariencia de celada entera.',
      'Fue luego a ver su rocín, y aunque tenía más cuartos que un real y más tachas que el caballo de Gonela —que tantum pellis et ossa fuit—, le pareció que ni el Bucéfalo de Alejandro ni Babieca el del Cid se le igualaban.',
      'Cuatro días se le pasaron en imaginar qué nombre le pondría, porque —según se decía él— no era razón que caballo de caballero tan famoso, con tan famoso nombre, no tuviese el suyo conocido.',
      'Y así, después de muchos nombres que formó, borró y quitó, añadió, deshizo y tornó a hacer en su memoria e imaginación, al fin le vino a llamar Rocinante, nombre a su parecer alto, sonoro y significativo de lo que había sido cuando fue rocín, antes de ser lo que ahora era.',
      'Puesto nombre a su caballo, quiso ponérsele a sí mismo, y en este pensamiento duró otros ocho días, y al cabo se vino a llamar don Quijote de la Mancha.'
    ]
  }
];

function request(method, path, headers, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'pagina-web-sp9h.onrender.com', path, method, headers };
    const req = https.request(opts, (res) => {
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

function generatePDF(book) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A5',
      margins: { top: 50, bottom: 50, left: 40, right: 40 }
    });

    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Portada
    doc.fontSize(18).font('Helvetica-Bold').text(book.title, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica').text(book.author, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#666').text('Edición digital - Biblioteca Digital', { align: 'center' });
    doc.addPage();

    // Contenido
    doc.fontSize(11).fillColor('#000').font('Helvetica');
    for (const line of book.content) {
      if (line.startsWith('CAPÍTULO')) {
        doc.moveDown();
        doc.fontSize(13).font('Helvetica-Bold').text(line, { align: 'center' });
        doc.fontSize(11).font('Helvetica');
        doc.moveDown();
      } else if (line.trim()) {
        doc.text(line, { align: 'justify', lineGap: 4 });
        doc.moveDown(0.3);
      }
    }

    doc.end();
  });
}

async function main() {
  // Login
  const login = await request('POST', '/api/auth/login', { 'Content-Type': 'application/json' },
    JSON.stringify({ email: 'admin@biblioteca.com', password: 'Admin123!' }));
  console.log('✓ Login exitoso');
  const token = login.data.token;

  for (const book of books) {
    console.log(`\nGenerando PDF: ${book.title}...`);
    const pdfBuffer = await generatePDF(book);
    console.log(`  PDF creado (${(pdfBuffer.length / 1024).toFixed(1)} KB, ${book.content.length + 2} páginas)`);

    // Upload
    const boundary = '----Boundary' + Date.now();

    function part(name, value, filename) {
      let header = `--${boundary}\r\nContent-Disposition: form-data; name="${name}"`;
      if (filename) header += `; filename="${filename}"\r\nContent-Type: application/pdf`;
      header += '\r\n\r\n';
      return Buffer.concat([
        Buffer.from(header, 'utf-8'),
        Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf-8'),
        Buffer.from('\r\n', 'utf-8')
      ]);
    }

    const body = Buffer.concat([
      part('title', book.title),
      part('author', book.author),
      part('description', book.description),
      part('category', book.category),
      part('file', pdfBuffer, book.filename),
      Buffer.from(`--${boundary}--\r\n`, 'utf-8')
    ]);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': body.length
    };

    const result = await request('POST', '/api/books', headers, body);
    if (result.status === 201) {
      console.log(`  ✓ Subido exitosamente (ID: ${result.data.book.id})`);
    } else {
      console.log(`  ✗ Error: ${JSON.stringify(result.data)}`);
    }
  }

  console.log('\n¡Listo!');
}

main().catch(console.error);
