import type { APIRoute } from 'astro';
import { LASTFM_API_KEY } from 'astro:env/server';

export const prerender = false;

const getLastfmApiKey = () => LASTFM_API_KEY;
const LASTFM_USER = 'casungo';
const API_URL = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${getLastfmApiKey()}&limit=1&format=json`;

export const GET: APIRoute = async () => {
  try {
    const apiResponse = await fetch(API_URL, {
      method: 'GET',
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
