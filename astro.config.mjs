import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { repairGlosses } from './scripts/interlinear/repair-glosses.mjs';

// URL preferida do site, usada ao gerar metadados e links absolutos.
// Na Cloudflare Pages, CF_PAGES_URL é injetada na compilação.
const site = process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://prima-scriptura.netlify.app';
export default defineConfig({
  site,
  integrations: [{
    name: 'revisao-de-glosas',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const { count, books } = await repairGlosses(fileURLToPath(dir));
        logger.info(`${count} glosas corrigidas após verificação de ${books} livros`);
      },
    },
  }],
});
