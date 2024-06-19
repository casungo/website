import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';

export const prerender = false;

export const GET: APIRoute = async () => {
  const LastfmApiKey = getSecret('LASTFM_API_KEY');
  const user = 'casungo';
  const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LastfmApiKey}&limit=1&format=json`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {},
    });

    const data = await apiResponse.json();

    return new Response(JSON.stringify(data), {
      status: apiResponse.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
