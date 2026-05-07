/**
 * SCRIPT: syncVideoDurations.mjs
 * 
 * Sincroniza las duraciones de videos de YouTube en moduleResources.js
 * con las duraciones reales obtenidas de YouTube.
 * 
 * USO:
 *   node src/components/IALab/constants/syncVideoDurations.mjs
 * 
 * Este script:
 * 1. Lee todos los videos de moduleResources.js
 * 2. Obtiene la duración real de cada video desde YouTube
 * 3. Actualiza el archivo moduleResources.js con las duraciones correctas
 * 4. Genera un reporte de cambios
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Obtiene la duración de un video de YouTube usando su página web
 */
function getYoutubeDuration(videoId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.youtube.com',
      path: '/watch?v=' + videoId + '&hl=en&gl=US',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cookie': 'CONSENT=YES+cb.20240101-04-p0.en+FX+123; GPS=1; VISITOR_INFO1_LIVE=test123'
      }
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Pattern 1: lengthSeconds in ytInitialPlayerResponse
        const match1 = data.match(/"lengthSeconds":"(\d+)"/);
        if (match1) {
          const secs = parseInt(match1[1]);
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          resolve({ seconds: secs, formatted: m + ':' + String(s).padStart(2, '0') });
          return;
        }
        
        // Pattern 2: meta itemprop duration
        const match2 = data.match(/<meta itemprop="duration" content="([^"]+)"/);
        if (match2) {
          let val = match2[1].replace('PT', '');
          const mMatch = val.match(/(\d+)M/);
          const sMatch = val.match(/(\d+)S/);
          const m = mMatch ? parseInt(mMatch[1]) : 0;
          const s = sMatch ? parseInt(sMatch[1]) : 0;
          resolve({ seconds: m * 60 + s, formatted: m + ':' + String(s).padStart(2, '0') });
          return;
        }
        
        resolve(null);
      });
    }).on('error', reject);
  });
}

/**
 * Extrae el ID de video de YouTube de una URL
 */
function extractVideoId(url) {
  if (!url) return null;
  
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Lee el archivo moduleResources.js y extrae todos los videos
 */
function extractVideosFromResources() {
  const filePath = path.join(__dirname, 'moduleResources.js');
  const content = fs.readFileSync(filePath, 'utf8');
  
  const videos = [];
  const videoPattern = /url:\s*["']https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)[^"']*["'][\s\S]*?duration:\s*["']([^"']+)["']/g;
  let match;
  
  while ((match = videoPattern.exec(content)) !== null) {
    videos.push({
      videoId: match[1],
      currentDuration: match[2],
      fullMatch: match[0]
    });
  }
  
  return videos;
}

/**
 * Actualiza las duraciones en el archivo moduleResources.js
 */
function updateDurationsInFile(videos) {
  const filePath = path.join(__dirname, 'moduleResources.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  let changes = 0;
  
  videos.forEach(video => {
    if (video.newDuration && video.newDuration !== video.currentDuration) {
      const oldPattern = `(url:\\s*["']https?:\\/\\/www\\.youtube\\.com\\/embed\\/${video.videoId}[^"']*["'][\\s\\S]*?duration:\\s*["'])${video.currentDuration}(["'])`;
      const regex = new RegExp(oldPattern);
      
      const replacement = `$1${video.newDuration}$2`;
      content = content.replace(regex, replacement);
      changes++;
    }
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  return changes;
}

/**
 * Función principal
 */
async function main() {
  console.log('🎬 Sincronizando duraciones de videos de YouTube...\n');
  
  const videos = extractVideosFromResources();
  console.log(`📹 Se encontraron ${videos.length} videos en moduleResources.js\n`);
  
  const results = [];
  
  for (const video of videos) {
    process.stdout.write(`  ⏳ ${video.videoId} (${video.currentDuration})... `);
    
    try {
      const duration = await getYoutubeDuration(video.videoId);
      
      if (duration) {
        video.newDuration = duration.formatted;
        const changed = duration.formatted !== video.currentDuration ? '✏️ CAMBIADO' : '✅ OK';
        console.log(`${duration.formatted} [${changed}]`);
        results.push({
          videoId: video.videoId,
          oldDuration: video.currentDuration,
          newDuration: duration.formatted,
          changed: duration.formatted !== video.currentDuration
        });
      } else {
        video.newDuration = video.currentDuration;
        console.log('❌ No se pudo obtener');
        results.push({
          videoId: video.videoId,
          oldDuration: video.currentDuration,
          newDuration: null,
          changed: false
        });
      }
    } catch (error) {
      video.newDuration = video.currentDuration;
      console.log('❌ Error: ' + error.message);
      results.push({
        videoId: video.videoId,
        oldDuration: video.currentDuration,
        newDuration: null,
        changed: false
      });
    }
    
    await sleep(1000); // Esperar 1 segundo entre solicitudes
  }
  
  // Actualizar el archivo
  console.log('\n💾 Actualizando moduleResources.js...');
  const changes = updateDurationsInFile(videos);
  
  // Generar reporte
  console.log('\n📊 REPORTE DE SINCRONIZACIÓN:');
  console.log('=' .repeat(60));
  
  const changedVideos = results.filter(r => r.changed);
  const unchangedVideos = results.filter(r => !r.changed && r.newDuration);
  const failedVideos = results.filter(r => !r.newDuration);
  
  console.log(`\n✅ Sin cambios: ${unchangedVideos.length}`);
  console.log(`✏️ Actualizados: ${changedVideos.length}`);
  console.log(`❌ Fallidos: ${failedVideos.length}`);
  
  if (changedVideos.length > 0) {
    console.log('\n📝 Videos actualizados:');
    changedVideos.forEach(v => {
      console.log(`  ${v.videoId}: ${v.oldDuration} → ${v.newDuration}`);
    });
  }
  
  if (failedVideos.length > 0) {
    console.log('\n⚠️ Videos que no se pudieron actualizar:');
    failedVideos.forEach(v => {
      console.log(`  ${v.videoId}: ${v.oldDuration}`);
    });
    console.log('\n  💡 Estos videos necesitan actualización manual.');
  }
  
  console.log('\n✨ Sincronización completada.');
}

main().catch(console.error);
