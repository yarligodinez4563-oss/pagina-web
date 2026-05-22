const https = require('https');
const PDFDocument = require('pdfkit');

const API = 'https://pagina-web-sp9h.onrender.com';
const ADMIN_EMAIL = 'admin@biblioteca.com';
const ADMIN_PASSWORD = 'Admin123!';

const books = [
  {
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes Saavedra',
    category: 'Clásicos',
    description: 'El ingenioso hidalgo don Quijote de la Mancha es la obra cumbre de la literatura española. Publicada en dos partes (1605 y 1615), narra las aventuras de Alonso Quijano, un hidalgo que pierde la razón por leer demasiados libros de caballerías y decide salir en busca de aventuras.',
    content: [
      'CAPÍTULO PRIMERO: Que trata de la condición y ejercicio del famoso hidalgo don Quijote de la Mancha',
      'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.',
      'Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.',
      'El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino.',
      'Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza que así ensillaba el rocín como tomaba la podadera.',
      'Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza.',
      'Quieren decir que tenía el sobrenombre de Quijada o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quejana.',
      'Es, pues, de saber que este sobredicho hidalgo, los ratos que estaba ocioso —que eran los más del año—, se daba a leer libros de caballerías, con tanta afición y gusto que olvidó casi de todo punto el ejercicio de la caza y aun la administración de su hacienda.',
      'Y llegó a tanto su curiosidad y desatino en esto que vendió muchas hanegas de tierra de sembradura para comprar libros de caballerías en que leer, y así, llevó a su casa todos cuantos pudo haber dellos.',
      'En efecto, rematado ya su juicio, vino a dar en el más extraño pensamiento que jamás dio loco en el mundo, y fue que le pareció convenible y necesario, así para el aumento de su honra como para el servicio de su república, hacerse caballero andante y irse por todo el mundo con sus armas y caballo a buscar aventuras.',
      'Y lo primero que hizo fue limpiar las armas que habían sido de sus bisabuelos, que, tomadas de orín y llenas de moho, luengos siglos había que estaban puestas y olvidadas en un rincón.',
      'Puesto nombre a su caballo, quiso ponérsele a sí mismo, y en este pensamiento duró otros ocho días, y al cabo se vino a llamar don Quijote de la Mancha.'
    ]
  },
  {
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    category: 'Novela',
    description: 'Obra maestra del realismo mágico que narra la historia de la familia Buendía en Macondo, un pueblo fundado por José Arcadio Buendía. Considerada una de las novelas más importantes del siglo XX.',
    content: [
      'CAPÍTULO PRIMERO',
      'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.',
      'Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos.',
      'El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo.',
      'Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba su carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos.',
      'José Arcadio Buendía, cuya imaginación desbordaba el ingenio de la naturaleza, convenció a los demás hombres de la aldea para que le pagaran el viaje en busca de las maravillas del mundo.',
      'Fue así como emprendieron la travesía de la sierra, y al cabo de varios meses de caminata extenuante, llegaron a una región donde el agua era escasa y la tierra estéril.',
      'José Arcadio Buendía soñó esa noche que en aquel lugar se levantaba una ciudad ruidosa con casas de paredes de espejo. Preguntó qué ciudad era aquella, y le respondieron con un nombre que nunca había oído, que no tenía significado.',
      'Al día siguiente, convenció a sus hombres de que nunca encontrarían el mar. Les ordenó derribar los árboles para hacer un claro junto al río, y allí fundaron la aldea de Macondo.',
      'José Arcadio Buendía decidió entonces que la ruta del descubrimiento científico era el único camino posible hacia la felicidad.',
      'Se encerró en el laboratorio, rodeado de mapas y alambiques, y empezó a experimentar con el mercurio y otros metales, en un vano intento por descubrir la fórmula de la piedra filosofal.',
      'Pero nada de esto alteró la rutina del pueblo. Las mujeres seguían lavando la ropa en el río, los hombres sembraban la tierra, y los niños jugaban en las calles de tierra.',
      'Años después, cuando Macondo se había convertido en un pueblo próspero, llegaron nuevas familias y con ellas los primeros signos de civilización: la iglesia, la escuela y el telégrafo.',
      'Pero la maldición de los Buendía persistía, y cada generación repetía los mismos errores, como si el tiempo fuera un círculo vicioso del que nadie podía escapar.',
      'Y así, entre guerras, amores imposibles y profecías cumplidas, la familia Buendía y Macondo vivieron cien años de soledad, hasta que un viento huracanado borró todo rastro de su existencia, como si nunca hubieran existido.'
    ]
  },
  {
    title: '1984',
    author: 'George Orwell',
    category: 'Ciencia ficción',
    description: 'Una distopía sobre un régimen totalitario donde el Gran Hermano lo vigila todo y la libertad es un sueño del pasado. Publicada en 1949, sigue siendo una de las novelas más influyentes del siglo XX.',
    content: [
      'PARTE PRIMERA',
      'Era un día frío y luminoso de abril, y los relojes daban las trece.',
      'Winston Smith, con la barbilla clavada en el pecho para escapar del viento terrible, se deslizó rápidamente por las puertas de cristal del bloque de pisos de la Victoria.',
      'Pero en su interior, el aire caliente parecía llevar el olor de la col hervida y las esterillas viejas de goma.',
      'En el rellano, una propaganda coloreada y pegada a la pared contemplaba el paso de los vecinos. La cara, una cara de unos cuarenta y cinco años, con un bigote negro y tosco, le miraba fijamente.',
      'BIG HERMANO TE VIGILA, decía el pie de la foto.',
      'En el interior del piso, una voz melodiosa leía una larga lista de cifras referentes a la producción de fundición de hierro en el noveno trimestre.',
      'La voz procedía de una placa de metal ovalada, una teletonta, empotrada en la pared, a la derecha del orinal.',
      'Winston ajustó el dial y la voz se hizo más sutil; no había modo de saber si lo que decía era verdad o mentira.',
      'El Partido decía que Oceanía nunca había tenido alianzas con Eurasia. Él recordaba que sí, pero eso era herejía.',
      'La neolengua, el nuevo lenguaje inventado por el Partido, reducía el vocabulario año tras año. Cuantas menos palabras, menos posibilidad de pensamiento rebelde.',
      'Pero Winston guardaba un secreto: un diario. Papel, en un mundo donde el papel era escaso y la escritura privada un delito.',
      'Empezó a escribir: "LIBERTAD ES LA LIBERTAD DE DECIR QUE DOS MÁS DOS SON CUATRO. SI SE CONCEDE ESO, TODO LO DEMÁS VIENE POR AÑADIDURA".',
      'Sabía que estaba firmando su sentencia de muerte. Pero también sabía que, de algún modo, mientras escribía, era libre.'
    ]
  },
  {
    title: 'El Principito',
    author: 'Antoine de Saint-Exupéry',
    category: 'Literatura infantil',
    description: 'Un piloto perdido en el desierto conoce a un pequeño príncipe que viene de otro planeta. Una historia sobre la amistad, el amor y la vida que ha cautivado a lectores de todas las edades.',
    content: [
      'CAPÍTULO I',
      'Cuando yo tenía seis años, vi una vez una lámina magnífica en un libro sobre la selva virgen que se llamaba "Historias vividas".',
      'Representaba una serpiente boa que se tragaba a una fiera. Copié el dibujo y se lo enseñé a las personas mayores, preguntándoles si les daba miedo.',
      'Me respondieron: "¿Por qué habría de dar miedo un sombrero?"',
      'Mi dibujo no representaba un sombrero. Representaba una boa que digería un elefante. Como las personas mayores no entendían, dibujé el interior de la boa para que pudieran verlo.',
      'Las personas mayores siempre necesitan explicaciones. Mi consejo es: no perder tiempo con ellas.',
      'Así fue como abandoné, a los seis años, una magnífica carrera de pintor.',
      'He tenido que escoger otro oficio y aprendí a pilotar aviones. He volado un poco por todo el mundo y la geografía, es cierto, me ha servido de mucho.',
      'He conocido muchas personas mayores. He visto de cerca muchas de ellas, pero no han mejorado mi opinión.',
      'CAPÍTULO II',
      'Viví así, solo, sin nadie con quien hablar verdaderamente, hasta que tuve una avería en el desierto del Sahara, hace seis años.',
      'Algo se había roto en mi motor. Y como no tenía conmigo ni mecánico ni pasajeros, me dispuse a realizar, yo solo, una reparación difícil.',
      'La primera noche dormí sobre la arena a mil millas de toda tierra habitada. Estaba más aislado que un náufrago en una balsa en medio del océano.',
      'Cuando amaneció, una extraña vocecita me despertó. Decía: "Por favor... ¡dibújame un cordero!"',
      'Me puse en pie de un salto. Un niño extraordinario me miraba fijamente. Nunca había visto a un niño semejante.',
      'Después de mucho trabajo, dibujé un cordero que le gustó. Así fue como conocí al principito.',
      'CAPÍTULO XXI',
      'Fue entonces cuando apareció el zorro. "Buenos días", dijo el zorro.',
      '"Buenos días", respondió cortésmente el principito. "¿Quién eres? Eres muy bonito..."',
      '"Soy un zorro", dijo el zorro. "Ven a jugar conmigo", le propuso el principito. "Estoy tan triste..."',
      '"No puedo jugar contigo", dijo el zorro. "No estoy domesticado".',
      'El principito comprendió entonces el valor de la amistad. "Lo esencial es invisible a los ojos", le enseñó el zorro.',
      '"Solo se ve bien con el corazón. Lo esencial es invisible a los ojos."'
    ]
  },
  {
    title: 'Orgullo y Prejuicio',
    author: 'Jane Austen',
    category: 'Novela',
    description: 'Una de las novelas más famosas de la literatura inglesa. Explora los sentimientos encontrados entre Elizabeth Bennet y el señor Darcy en la Inglaterra rural del siglo XIX.',
    content: [
      'CAPÍTULO PRIMERO',
      'Es una verdad universalmente reconocida que un hombre soltero, poseedor de una gran fortuna, necesita una esposa.',
      'Aunque los sentimientos y opiniones de poca monta de tal hombre sean poco conocidos al entrar en un vecindario, esta verdad está tan bien arraigada en la mente de las familias vecinas, que le consideran propiedad legítima de alguna de sus hijas.',
      '—Mi querido señor Bennet —le dijo un día su señora—, ¿ha oído usted decir que Netherfield Park ha sido por fin alquilado?',
      'El señor Bennet respondió que no.',
      '—Pues así es —repitió ella—. La señora de Long ha estado aquí y me lo ha contado todo.',
      'El señor Bennet no respondió.',
      '—¿No deseas saber quién se lo ha alquilado? —exclamó su mujer impaciente.',
      '—Tú deseas decírmelo y no tengo inconveniente en oírlo.',
      'Esta invitación fue suficiente para la señora Bennet. —Pues has de saber, querido, que Netherfield ha sido alquilado por un joven rico, de una gran fortuna, del norte de Inglaterra.',
      '—¿Cómo se llama?',
      '—Bingley.',
      '—¿Está casado o es soltero?',
      '—¡Soltero, querido, soltero! Un hombre soltero de buena fortuna; cuatro o cinco mil libras al año. ¡Qué magnífico partido para una de nuestras hijas!',
      '—¿Y qué importa eso? ¿Qué relación tiene con ellas?',
      '—¡Querido señor Bennet! —respondió su esposa—. ¡Cómo puedes ser tan fastidioso! Debes saber que estoy pensando en casarlo con una de ellas.',
      '—¿Esa es su intención al instalarse aquí?',
      '—¡Intención! ¡Qué disparate! ¿Cómo puedes hablar así? Pero es muy posible que le guste una de ellas, y por eso debe visitarle en cuanto llegue.',
      '—No veo la necesidad. Puedes ir tú con las niñas, o mejor mándalas solas, porque quizás siendo tú tan guapa como cualquiera de ellas, Bingley te prefiera a ti.',
      'La señora Bennet le dirigió una mirada de desprecio y continuó hablando de sus planes para casar a sus hijas con el rico señor Bingley.'
    ]
  },
  {
    title: 'Crimen y Castigo',
    author: 'Fiódor Dostoyevski',
    category: 'Novela',
    description: 'Un joven estudiante comete un asesinato y debe enfrentar las consecuencias psicológicas de su acto. Una exploración profunda de la moral, la culpa y la redención.',
    content: [
      'PARTE PRIMERA - CAPÍTULO I',
      'A principios de julio, en un calor extremo, hacia el atardecer, un joven salió del cuartucho que tenía alquilado en la calle S. y, lentamente, con indecisión, se dirigió al puente K.',
      'Había evitado encontrarse con su patrona, a quien le debía el alquiler. Subió a su cuarto con miedo de encontrar a alguien.',
      'Su cuarto era una pequeña celda de unos seis pasos de largo, con un empapelado amarillento y polvoriento que se desprendía de las paredes.',
      'El joven se dejó caer en un sofá destartalado y cerró los ojos. Estaba sumido en sus pensamientos.',
      'Llevaba un mes dándole vueltas a la misma idea, una idea que le atormentaba y le fascinaba a partes iguales.',
      'Raskólnikov —así se llamaba el joven— había abandonado la universidad por falta de dinero. Vivía en la miseria más absoluta.',
      'Pero no era tanto la pobreza lo que le atormentaba como la humillación de tener que soportarla.',
      'Había empeñado sus últimos objetos de valor con una vieja usurera, Aliona Ivanovna, una mujer avarienta que trataba a sus clientes con desprecio.',
      '"Es una criatura inútil, dañina, una piojo", pensaba Raskólnikov. "¿Merece vivir? ¿No sería mejor eliminarla y usar su dinero para hacer el bien?"',
      'Así germinó en su mente la idea del asesinato. Creía que algunos hombres superiores tenían derecho a transgredir las leyes en nombre de un bien mayor.',
      'Napoleón, pensaba, no se habría detenido ante una vieja usurera para alcanzar sus metas.',
      'Pero la noche anterior había recibido una carta de su madre contándole que su hermana Dunia iba a casarse con un hombre rico pero ruin, para sacar a la familia de la pobreza.',
      '"¡No!", exclamó Raskólnikov. "Mientras yo viva, no permitiré ese sacrificio. Prefiero... prefiero hacer lo que he estado planeando."',
      'Y esa misma noche, como movido por una fuerza superior, tomó el hacha y se dirigió a casa de la vieja usurera.',
      'El resto es historia. Pero la verdadera historia no era el crimen, sino lo que vino después: el castigo.'
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
    const doc = new PDFDocument({ size: 'A5', margins: { top: 50, bottom: 50, left: 40, right: 40 } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const title = book.author.split(',')[0] || book.author;
    const filename = book.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '.pdf';

    doc.fontSize(20).font('Helvetica-Bold').text(book.title, { align: 'center' });
    doc.moveDown(1.5);
    doc.fontSize(14).font('Helvetica').text(book.author, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor('#888').text('Edición digital © Biblioteca Digital', { align: 'center' });
    doc.addPage();

    doc.fontSize(11).fillColor('#222').font('Helvetica');
    for (const line of book.content) {
      if (line.startsWith('CAPÍTULO') || line.startsWith('PARTE')) {
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
  console.log('🔑 Iniciando sesión como admin...');
  const login = await request('POST', '/api/auth/login', { 'Content-Type': 'application/json' },
    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }));
  
  if (login.status !== 200) {
    console.log('❌ Error de login:', login.data);
    return;
  }
  
  const token = login.data.token;
  console.log('✅ Login exitoso\n');

  for (const book of books) {
    console.log(`📖 Generando PDF: ${book.title}...`);
    
    const pdfBuffer = await generatePDF(book);
    const sizeKB = (pdfBuffer.length / 1024).toFixed(1);
    console.log(`   ✅ PDF creado (${sizeKB} KB)`);

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

    const filename = book.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '.pdf';

    const body = Buffer.concat([
      part('title', book.title),
      part('author', book.author),
      part('description', book.description),
      part('category', book.category),
      part('file', pdfBuffer, filename),
      Buffer.from(`--${boundary}--\r\n`, 'utf-8')
    ]);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': body.length
    };

    const result = await request('POST', '/api/books', headers, body);
    if (result.status === 201) {
      console.log(`   ✅ Subido: ${book.title} (ID: ${result.data.book.id})`);
    } else {
      console.log(`   ❌ Error: ${JSON.stringify(result.data)}`);
    }
    console.log('');
  }

  console.log('🎉 Todos los libros con PDF han sido subidos exitosamente.');
  console.log('📚 Refresca tu página web para verlos.');
}

main().catch(console.error);
