import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, env }) => {
  const key = params.path;

  if (!key) {
    return new Response('Not Found', { status: 404 });
  }

  const object = await env.R2.get(key);

  if (object === null) {
    return new Response('Object Not Found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new Response(object.body, {
    headers,
  });
};
