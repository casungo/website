
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mapping of URLs to output filenames (relative to src/images)
const SITES = [
  { url: 'https://berealgdprviewer.eu', filename: 'bereal.png' },
  { url: 'https://exceltomarkdown.app', filename: 'excel2md.png' },
  { url: 'https://splityourmedia.top', filename: 'splitmedia.png' },
  { url: 'https://casungo.top', filename: 'webscreenshot.png' },
  { url: 'https://briefmakerapp.com', filename: 'briefmaker.png' }
];

// Manually load .env file since we are running a raw node script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

try {
  process.loadEnvFile(envPath);
} catch (error) {
  // .env might not exist or be readable, which is fine if env vars are set otherwise
  // or if we are in environment that doesn't use .env files
  if (error.code !== 'ENOENT') {
    console.warn(`Warning: Failed to load .env file: ${error.message}`);
  }
}

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('Error: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables are required.');
  process.exit(1);
}


const OUTPUT_DIR = path.join(__dirname, '../src/images');


async function takeScreenshot(site) {
  console.log(`Taking screenshot of ${site.url}...`);
  
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/browser-rendering/screenshot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: site.url,
        viewport: {
          width: 1280,
          height: 720,
        },
        screenshotOptions: {
          fullPage: false, // Set to true if you want full page, but cards usually look better with a viewport shot
        }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error ${response.status}: ${text}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const outputPath = path.join(OUTPUT_DIR, site.filename);
    
    await fs.writeFile(outputPath, buffer);
    console.log(`✓ Saved to ${site.filename}`);
  } catch (error) {
    console.error(`✗ Failed to screenshot ${site.url}:`, error.message);
  }
}

async function main() {
  // Ensure output directory exists (though it usually should)
  try {
    await fs.access(OUTPUT_DIR);
  } catch {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }

  // Run sequentially to avoid rate limits or overwhelming the service
  for (const site of SITES) {
    await takeScreenshot(site);
    // Wait to avoid rate limits
    if (SITES.indexOf(site) < SITES.length - 1) {
      console.log('Waiting 10s...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}

main();
