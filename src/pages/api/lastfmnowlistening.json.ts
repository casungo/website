import type { APIRoute } from "astro";
import { LASTFM_API_KEY } from "astro:env/server";

export const prerender = false;

const getLastfmApiKey = () => LASTFM_API_KEY;
const LASTFM_USER = "casungo";
const API_URL = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${getLastfmApiKey()}&limit=1&format=json`;

// Response from the API if the user is listening to something:
// {
//     "recenttracks": {
//         "track": [
//             {
//                 "artist": {
//                     "mbid": "8691d44e-7143-4edb-a72c-1cbc7d1a0867",
//                     "#text": "Salmo"
//                 },
//                 "streamable": "0",
//                 "image": [
//                     {
//                         "size": "small",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/34s/8a301157652ffdb04492c39ce6c639f9.jpg"
//                     },
//                     {
//                         "size": "medium",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/64s/8a301157652ffdb04492c39ce6c639f9.jpg"
//                     },
//                     {
//                         "size": "large",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/174s/8a301157652ffdb04492c39ce6c639f9.jpg"
//                     },
//                     {
//                         "size": "extralarge",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/8a301157652ffdb04492c39ce6c639f9.jpg"
//                     }
//                 ],
//                 "mbid": "0ac863eb-5762-4c68-840f-d5abf813e516",
//                 "album": {
//                     "mbid": "aea44f54-6e1b-4b4e-8901-2f8251c38728",
//                     "#text": "Playlist"
//                 },
//                 "name": "RICCHI E MORTI",
//                 "@attr": {
//                     "nowplaying": "true"
//                 },
//                 "url": "https://www.last.fm/music/Salmo/_/RICCHI+E+MORTI"
//             },
//             {
//                 "artist": {
//                     "mbid": "45ef37f0-7a37-4f8e-9909-47c0f02ec668",
//                     "#text": "Baby Gang"
//                 },
//                 "streamable": "0",
//                 "image": [
//                     {
//                         "size": "small",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/34s/357c90c246375271858fb233cf96cac8.jpg"
//                     },
//                     {
//                         "size": "medium",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/64s/357c90c246375271858fb233cf96cac8.jpg"
//                     },
//                     {
//                         "size": "large",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/174s/357c90c246375271858fb233cf96cac8.jpg"
//                     },
//                     {
//                         "size": "extralarge",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/357c90c246375271858fb233cf96cac8.jpg"
//                     }
//                 ],
//                 "mbid": "",
//                 "album": {
//                     "mbid": "",
//                     "#text": "L'Angelo del Male"
//                 },
//                 "name": "Adrenalina (feat. BLANCO, Marracash)",
//                 "url": "https://www.last.fm/music/Baby+Gang/_/Adrenalina+(feat.+BLANCO,+Marracash)",
//                 "date": {
//                     "uts": "1721426922",
//                     "#text": "19 Jul 2024, 22:08"
//                 }
//             }
//         ],
//         "@attr": {
//             "user": "casungo",
//             "totalPages": "80048",
//             "page": "1",
//             "perPage": "1",
//             "total": "80048"
//         }
//     }
// }

// Response from the API if the user is not listening to anything:
// {
//     "recenttracks": {
//         "track": [
//             {
//                 "artist": {
//                     "mbid": "59db3d82-86ea-451f-881f-dffc8ec387c9",
//                     "#text": "Metro Boomin"
//                 },
//                 "streamable": "0",
//                 "image": [
//                     {
//                         "size": "small",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/34s/2e8e2f18f90297fa60c4ff6fb36f1116.jpg"
//                     },
//                     {
//                         "size": "medium",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/64s/2e8e2f18f90297fa60c4ff6fb36f1116.jpg"
//                     },
//                     {
//                         "size": "large",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/174s/2e8e2f18f90297fa60c4ff6fb36f1116.jpg"
//                     },
//                     {
//                         "size": "extralarge",
//                         "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/2e8e2f18f90297fa60c4ff6fb36f1116.jpg"
//                     }
//                 ],
//                 "mbid": "",
//                 "album": {
//                     "mbid": "66de5e14-0642-4803-998c-3ecdf504134d",
//                     "#text": "HEROES & VILLAINS"
//                 },
//                 "name": "Trance (with Travis Scott & Young Thug)",
//                 "url": "https://www.last.fm/music/Metro+Boomin/_/Trance+(with+Travis+Scott+&+Young+Thug)",
//                 "date": {
//                     "uts": "1721426731",
//                     "#text": "19 Jul 2024, 22:05"
//                 }
//             }
//         ],
//         "@attr": {
//             "user": "casungo",
//             "totalPages": "80047",
//             "page": "1",
//             "perPage": "1",
//             "total": "80047"
//         }
//     }
// }

export const GET: APIRoute = async () => {
  try {
    const apiResponse = await fetch(API_URL, {
      method: "GET",
    });

    const data = await apiResponse.json();

    const recentTracks = data.recenttracks.track;
    const nowPlayingTrack = recentTracks[0];

    if (nowPlayingTrack && nowPlayingTrack["@attr"] && nowPlayingTrack["@attr"].nowplaying === "true") {
      const nowPlayingData = {
        NowPlayingArtist: nowPlayingTrack.artist["#text"],
        NowPlayingAlbum: nowPlayingTrack.album["#text"],
        NowPlayingAlbumArt: nowPlayingTrack.image[3]["#text"],
        NowPlayingName: nowPlayingTrack.name,
        NowPlayingUrl: nowPlayingTrack.url,
        LastPlayedName: recentTracks[1]?.name,
        LastPlayedUrl: recentTracks[1]?.url,
        IsUserListeningToSomething: true,
      };
      return new Response(JSON.stringify(nowPlayingData), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      const lastPlayedTrack = recentTracks[0];
      const lastPlayedData = {
        LastPlayedDate: lastPlayedTrack.date["#text"],
        LastPlayedName: lastPlayedTrack.name,
        LastPlayedUrl: lastPlayedTrack.url,
        IsUserListeningToSomething: false,
      };
      return new Response(JSON.stringify(lastPlayedData), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Failed to fetch data", errorMessage: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
