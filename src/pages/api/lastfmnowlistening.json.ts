import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';

export const GET: APIRoute = async () => {
  const LastfmApiKey = getSecret('LASTFM_API_KEY');
  const user = 'casungo';
  const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LastfmApiKey}&limit=1&format=json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
