// Prima Scriptura — GitHub OAuth para Decap CMS
// Cloudflare Worker (JavaScript, sem dependências externas)
// Requer os segredos/variáveis: GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET.
// Domínios administradores explicitamente autorizados (sem curingas).
const SITE_ORIGINS = new Map([
  ['prima-scriptura.pages.dev', 'https://prima-scriptura.pages.dev'],
  ['prima-scriptura.netlify.app', 'https://prima-scriptura.netlify.app'],
]);
const DEFAULT_SITE_ORIGIN = SITE_ORIGINS.get('prima-scriptura.pages.dev');
const ADMIN_LOGIN = 'israelalmeida1844-sys';
const COOKIE = 'prima_oauth_state';

function htmlMessage({ token, error, siteOrigin = DEFAULT_SITE_ORIGIN }) {
  const status = error ? 'error' : 'success';
  const payload = error
    ? { provider: 'github', error }
    : { provider: 'github', token };
  const outbound = `authorization:github:${status}:${JSON.stringify(payload)}`;
  // Evitar inserção de HTML dentro de <script> ao serializar mensagens.
  const js = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
  return new Response(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Login Prima Scriptura</title></head>
<body><p>${error ? 'Não foi possível entrar. Feche esta janela e tente novamente.' : 'Conectando ao Prima Scriptura…'}</p>
<script>
(() => {
  const origin = ${js(siteOrigin)};
  const handshake = 'authorizing:github';
  const response = ${js(outbound)};
  if (!window.opener) return;
  window.addEventListener('message', (event) => {
    if (event.source !== window.opener || event.origin !== origin || event.data !== handshake) return;
    window.opener.postMessage(response, origin);
  });
  window.opener.postMessage(handshake, origin);
})();
</script></body></html>`, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'Set-Cookie': `${COOKIE}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax`,
    },
  });
}

function cookieValue(request, key) {
  const cookies = request.headers.get('Cookie') ?? '';
  const part = cookies.split(';').map(s => s.trim()).find(s => s.startsWith(key + '='));
  return part?.slice(key.length + 1) ?? null;
}

async function handleAuth(request, env, url) {
  if (url.searchParams.get('provider') !== 'github') {
    return new Response('Provedor inválido.', { status: 400 });
  }
  // Apenas o site Prima Scriptura pode iniciar o fluxo administrativo.
  const siteId = url.searchParams.get('site_id');
  if (!SITE_ORIGINS.has(siteId)) {
    return new Response('Site não autorizado.', { status: 403 });
  }
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('Credenciais OAuth não configuradas.', { status: 503 });
  }
  const state = [...crypto.getRandomValues(new Uint8Array(24))]
    .map(n => n.toString(16).padStart(2, '0')).join('');
  const redirectURI = `${url.origin}/callback`;
  const githubURL = new URL('https://github.com/login/oauth/authorize');
  githubURL.search = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: redirectURI,
    scope: 'public_repo',
    state,
  }).toString();
  return new Response(null, {
    status: 302,
    headers: {
      Location: githubURL.toString(),
      'Set-Cookie': `${COOKIE}=${state}.${siteId}; Max-Age=600; Path=/; Secure; HttpOnly; SameSite=Lax`,
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

async function handleCallback(request, env, url) {
  const state = url.searchParams.get('state');
  // Vínculo do retorno OAuth ao domínio que iniciou a autorização.
  const saved = cookieValue(request, COOKIE) || '';
  const dot = saved.indexOf('.');
  const expected = dot >= 0 ? saved.slice(0, dot) : '';
  const siteId = dot >= 0 ? saved.slice(dot + 1) : '';
  const siteOrigin = SITE_ORIGINS.get(siteId);
  if (!state || !siteOrigin || !/^[0-9a-f]{48}$/.test(state) || state !== expected) {
    return htmlMessage({ error: 'Estado OAuth inválido. Reinicie o login.' });
  }
  const code = url.searchParams.get('code');
  if (!code || url.searchParams.has('error')) {
    return htmlMessage({ error: 'Autorização cancelada ou inválida.', siteOrigin });
  }
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return htmlMessage({ error: 'Credenciais do aplicativo ausentes.', siteOrigin });
  }
  try {
    const exchange = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/callback`,
      }),
    });
    if (!exchange.ok) throw new Error('Falha na troca do código OAuth');
    const data = await exchange.json();
    if (!data.access_token || data.error) throw new Error('Token não recebido');

    // Restringir o painel exclusivamente à conta escolhida.
    const who = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'prima-scriptura-admin',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!who.ok) throw new Error('Não foi possível verificar a conta');
    const account = await who.json();
    if (account.login !== ADMIN_LOGIN) {
      return htmlMessage({ error: 'Esta conta não tem autorização para administrar o Prima Scriptura.', siteOrigin });
    }
    return htmlMessage({ token: data.access_token, siteOrigin });
  } catch {
    return htmlMessage({ error: 'Falha na autenticação. Tente entrar novamente.', siteOrigin });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'GET') return new Response('Método não permitido.', { status: 405 });
    if (url.pathname === '/auth') return handleAuth(request, env, url);
    if (url.pathname === '/callback') return handleCallback(request, env, url);
    if (url.pathname === '/') return new Response('Prima Scriptura — serviço OAuth disponível.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
    return new Response('Rota não encontrada.', { status: 404 });
  },
};