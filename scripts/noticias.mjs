// Robot de noticias de Camino ciudadano. Lo corre GitHub Actions cada 30 minutos.
// Busca en Google Noticias (Colombia) lo último sobre la Fiscal General y lo guarda en noticias.json.
import { readFile, writeFile } from 'node:fs/promises';

const BUSQUEDAS = [
  '"Luz Adriana Camargo"',
  '"fiscal Camargo" Comisión de Acusación',
  '"fiscal general" Camargo renuncia'
];
const MAX = 80;
const ARCHIVO = new URL('../noticias.json', import.meta.url);

const decode = s => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/<[^>]+>/g, '').trim();
const tag = (xml, t) => { const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };

async function buscar(q) {
  const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(q + ' when:30d') + '&hl=es-419&gl=CO&ceid=CO:es-419';
  const res = await fetch(url, { headers: { 'User-Agent': 'camino-ciudadano-bot' } });
  if (!res.ok) throw new Error(q + ': HTTP ' + res.status);
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
    const it = m[1];
    let titulo = tag(it, 'title');
    const fuente = tag(it, 'source');
    if (fuente && titulo.endsWith(' - ' + fuente)) titulo = titulo.slice(0, -(fuente.length + 3));
    const fecha = new Date(tag(it, 'pubDate'));
    return { titulo, fuente, url: tag(it, 'link'), fecha: isNaN(fecha) ? null : fecha.toISOString() };
  }).filter(n => n.titulo && n.url && n.fecha);
}

let previo = { noticias: [] };
try { previo = JSON.parse(await readFile(ARCHIVO, 'utf8')); } catch {}

const todas = [...(previo.noticias || [])];
for (const q of BUSQUEDAS) {
  try { todas.push(...await buscar(q)); }
  catch (e) { console.error('No se pudo buscar', e.message); }
}

const vistos = new Set();
const noticias = todas
  .sort((a, b) => b.fecha.localeCompare(a.fecha))
  .filter(n => {
    const k = n.titulo.toLowerCase().replace(/\W+/g, ' ').trim();
    if (vistos.has(k)) return false;
    vistos.add(k); return true;
  })
  .slice(0, MAX);

const antes = JSON.stringify(previo.noticias || []);
if (antes === JSON.stringify(noticias)) { console.log('Sin noticias nuevas.'); process.exit(0); }

await writeFile(ARCHIVO, JSON.stringify({ actualizado: new Date().toISOString(), noticias }, null, 1) + '\n');
console.log('Guardadas', noticias.length, 'noticias.');
