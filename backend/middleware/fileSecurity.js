const fs = require('fs');

// Firmas magic bytes conocidas
const MAGIC_BYTES = {
  // Imágenes
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  gif87: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
  gif89: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  webp: [0x52, 0x49, 0x46, 0x46],
  bmp: [0x42, 0x4D],
  // Documentos
  pdf: [0x25, 0x50, 0x44, 0x46],
  epub: [0x50, 0x4B, 0x03, 0x04],
  zip: [0x50, 0x4B, 0x03, 0x04]
};

// Patrones de malware conocidos (firmas simples)
const MALWARE_PATTERNS = {
  phpShell: [
    Buffer.from('<?php', 'utf-8'),
    Buffer.from('<?=', 'utf-8'),
    Buffer.from('<?PHP', 'utf-8'),
    Buffer.from('<?', 'utf-8')
  ],
  scriptInjection: [
    Buffer.from('<script', 'utf-8'),
    Buffer.from('javascript:', 'utf-8'),
    Buffer.from('data:text/html', 'utf-8')
  ],
  executables: [
    Buffer.from('MZ', 'utf-8'),          // EXE/DLL
    Buffer.from('ELF', 'utf-8'),         // Linux ELF
    Buffer.from('#!', 'utf-8'),          // Shebang scripts
    Buffer.from('\x7fELF', 'utf-8'),
  ],
  htmlInImage: [
    Buffer.from('<html', 'utf-8'),
    Buffer.from('<svg', 'utf-8'),
    Buffer.from('<?xml', 'utf-8'),
  ]
};

// Validar firma (magic bytes) de un archivo
function checkMagicBytes(filepath, expectedSignatures) {
  const fd = fs.openSync(filepath, 'r');
  const buffer = Buffer.alloc(16);
  fs.readSync(fd, buffer, 0, 16, 0);
  fs.closeSync(fd);

  for (const sig of expectedSignatures) {
    let match = true;
    for (let i = 0; i < sig.length; i++) {
      if (buffer[i] !== sig[i]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

// Sanitizar nombre de archivo
function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 200);
}

// Escanear archivo en busca de malware
function scanFileForMalware(filepath) {
  const stats = fs.statSync(filepath);
  if (stats.size === 0) {
    return { safe: false, reason: 'El archivo está vacío.' };
  }

  // Leer primeros y últimos bytes del archivo
  const bufferSize = Math.min(stats.size, 8192);
  const startBuffer = Buffer.alloc(bufferSize);
  const endBuffer = Buffer.alloc(bufferSize);

  const fd = fs.openSync(filepath, 'r');
  fs.readSync(fd, startBuffer, 0, bufferSize, 0);

  // Leer final del archivo (para detectar polyglot files)
  const endPos = Math.max(0, stats.size - bufferSize);
  fs.readSync(fd, endBuffer, 0, Math.min(bufferSize, stats.size - endPos), endPos);
  fs.closeSync(fd);

  // Buscar patrones maliciosos
  for (const [patternName, patterns] of Object.entries(MALWARE_PATTERNS)) {
    for (const pattern of patterns) {
      if (startBuffer.includes(pattern) || endBuffer.includes(pattern)) {
        return { safe: false, reason: `Posible código malicioso detectado (${patternName}).` };
      }
    }
  }

  return { safe: true };
}

// Validar archivo de imagen
function validateImage(filepath, mimetype) {
  const signatureMap = {
    'image/jpeg': [MAGIC_BYTES.jpeg],
    'image/png': [MAGIC_BYTES.png],
    'image/gif': [MAGIC_BYTES.gif87, MAGIC_BYTES.gif89],
    'image/webp': [MAGIC_BYTES.webp],
    'image/bmp': [MAGIC_BYTES.bmp]
  };

  const magic = signatureMap[mimetype];
  if (!magic) {
    return { valid: false, error: 'Tipo de imagen no soportado.' };
  }

  if (!checkMagicBytes(filepath, magic)) {
    return { valid: false, error: 'La firma del archivo no coincide con el tipo de imagen.' };
  }

  // Escanear malware
  const scan = scanFileForMalware(filepath);
  if (!scan.safe) {
    return { valid: false, error: scan.reason };
  }

  return { valid: true };
}

// Validar archivo de libro
function validateBookFile(filepath, mimetype) {
  const signatureMap = {
    'application/pdf': [MAGIC_BYTES.pdf],
    'application/epub+zip': [MAGIC_BYTES.epub],
    'application/zip': [MAGIC_BYTES.zip]
  };

  const magic = signatureMap[mimetype];
  if (!magic) {
    return { valid: false, error: 'Tipo de archivo no soportado.' };
  }

  if (!checkMagicBytes(filepath, magic)) {
    return { valid: false, error: 'La firma del archivo no coincide con el tipo esperado.' };
  }

  // Escanear malware
  const scan = scanFileForMalware(filepath);
  if (!scan.safe) {
    return { valid: false, error: scan.reason };
  }

  return { valid: true };
}

module.exports = {
  sanitizeFilename,
  validateImage,
  validateBookFile,
  scanFileForMalware,
  checkMagicBytes
};
