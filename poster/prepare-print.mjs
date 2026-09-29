// Package the opaque Canvas PNG as a 300 dpi PNG and an exact 600 x 900 mm PDF.
// Run after exporting AIchemyPoster.exportPNG() to exports/AIchemy-60x90cm-300dpi.png.
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

const pngPath = new URL("./exports/AIchemy-60x90cm-300dpi.png", import.meta.url);
const png = readFileSync(pngPath);
const chunks = [];
for (let offset = 8; offset < png.length;) {
  const length = png.readUInt32BE(offset);
  chunks.push({
    type: png.toString("ascii", offset + 4, offset + 8),
    data: png.subarray(offset + 8, offset + 8 + length),
    raw: png.subarray(offset, offset + 12 + length),
  });
  offset += length + 12;
}
const header = chunks.find(c => c.type === "IHDR").data;
const width = header.readUInt32BE(0), height = header.readUInt32BE(4);
if (width !== 7087 || height !== 10630 || header[8] !== 8 || header[12] !== 0)
  throw new Error("Expected 7087 x 10630, 8-bit, noninterlaced Canvas PNG");
const channels = header[9] === 6 ? 4 : header[9] === 2 ? 3 : 0;
if (!channels) throw new Error("Expected RGB or RGBA PNG");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const result = Buffer.alloc(data.length + 12);
  result.writeUInt32BE(data.length);
  result.write(type, 4, "ascii");
  data.copy(result, 8);
  result.writeUInt32BE(crc32(result.subarray(4, -4)), result.length - 4);
  return result;
}
const density = Buffer.alloc(9);
density.writeUInt32BE(11811, 0);
density.writeUInt32BE(11811, 4);
density[8] = 1;
writeFileSync(pngPath, Buffer.concat([
  png.subarray(0, 8),
  ...chunks.filter(c => c.type !== "pHYs").flatMap(c =>
    c.type === "IHDR" ? [c.raw, chunk("pHYs", density)] : [c.raw]),
]));

// Undo PNG row filters, preserving every pixel; discard only the opaque alpha.
const packed = inflateSync(Buffer.concat(chunks.filter(c => c.type === "IDAT").map(c => c.data)));
const stride = width * channels;
let previous = Buffer.alloc(stride), row = Buffer.alloc(stride);
const rgb = Buffer.alloc(width * height * 3);
function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}
for (let y = 0; y < height; y++) {
  const start = y * (stride + 1), filter = packed[start];
  if (filter > 4) throw new Error("Invalid PNG filter");
  for (let x = 0; x < stride; x++) {
    const a = x >= channels ? row[x - channels] : 0;
    const b = previous[x], c = x >= channels ? previous[x - channels] : 0;
    const predict = filter === 1 ? a : filter === 2 ? b : filter === 3 ? ((a + b) >> 1) : filter === 4 ? paeth(a, b, c) : 0;
    row[x] = (packed[start + 1 + x] + predict) & 255;
  }
  for (let x = 0; x < width; x++) {
    const src = x * channels, dest = (y * width + x) * 3;
    if (channels === 4 && row[src + 3] !== 255) throw new Error("Canvas must be opaque");
    rgb[dest] = row[src]; rgb[dest + 1] = row[src + 1]; rgb[dest + 2] = row[src + 2];
  }
  [row, previous] = [previous, row];
}

const pageWidth = 600 / 25.4 * 72, pageHeight = 900 / 25.4 * 72;
const image = deflateSync(rgb, { level: 9 });
const commands = Buffer.from(`q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Art Do\nQ\n`);
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /TrimBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Art 4 0 R >> >> /Contents 5 0 R /Annots [7 0 R] >>`,
  Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Interpolate false /Filter /FlateDecode /Length ${image.length} >>\nstream\n`), image, Buffer.from("\nendstream")]),
  Buffer.concat([Buffer.from(`<< /Length ${commands.length} >>\nstream\n`), commands, Buffer.from("endstream")]),
  "<< /Title (AIchemy - 60 x 90 cm - Recruitment Poster) /Creator (AIchemy Canvas Artwork) >>",
  `<< /Type /Annot /Subtype /Link /Rect [${29 / 720 * pageWidth} ${6 / 1080 * pageHeight} ${691 / 720 * pageWidth} ${42 / 1080 * pageHeight}] /Border [0 0 0] /A << /S /URI /URI (https://aichemy.club) >> >>`,
];
const parts = [Buffer.from("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n", "binary")];
let length = parts[0].length;
const offsets = [0];
objects.forEach((object, i) => {
  offsets.push(length);
  const part = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`), Buffer.isBuffer(object) ? object : Buffer.from(object), Buffer.from("\nendobj\n")]);
  parts.push(part); length += part.length;
});
const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(o => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${length}\n%%EOF\n`;
parts.push(Buffer.from(xref));
writeFileSync(new URL("./exports/AIchemy-60x90cm.pdf", import.meta.url), Buffer.concat(parts));
console.log(`Print files ready: ${width} x ${height} px, 300 dpi; PDF 600 x 900 mm, 1 page.`);
