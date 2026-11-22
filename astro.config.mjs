import { defineConfig } from 'astro/config';

// URL preferida do site, usada ao gerar metadados e links absolutos.
// Na Cloudflare Pages, CF_PAGES_URL é injetada na compilação.
const site = process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://prima-scriptura.netlify.app';
export default defineConfig({ site });
