/**
 * Generate OG images (1200x630) for all pages
 * Run: node scripts/generate-og.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../src/assets/images/og');
const WIDTH = 1200;
const HEIGHT = 630;

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const ACCENT = '#8B00FF';
const ACCENT_LIGHT = '#B340FF';
const TEXT = '#FFFFFF';
const TEXT_DIM = '#BBBBBB';
const SUCCESS = '#00E676';
const INFO = '#64B5F6';
const HUB = '#FFEA00';

function makeBadge(text, color) {
  return `<rect x="60" y="510" rx="20" height="40" width="${Math.max(140, text.length * 14 + 20)}" fill="${color}33" stroke="${color}" stroke-width="2"/>
  <text x="80" y="538" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="${color}" text-transform="uppercase" letter-spacing="0.5px">${text}</text>`;
}

function makeSvg({ title, description, badgeText, badgeColor }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a001a"/>
      <stop offset="100%" style="stop-color:#000000"/>
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
  
  <g opacity="0.03">
    ${Array.from({ length: 25 }, (_, i) => 
      `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${HEIGHT}" stroke="${ACCENT}" stroke-width="1"/>
       <line x1="0" y1="${i * 25}" x2="${WIDTH}" y2="${i * 25}" stroke="${ACCENT}" stroke-width="1"/>`
    ).join('')}
  </g>
  
  <line x1="0" y1="0" x2="${WIDTH}" y2="0" stroke="${ACCENT}" stroke-width="4"/>
  
  <g transform="translate(60, 60)">
    <rect x="0" y="0" width="80" height="80" rx="16" fill="${ACCENT}" filter="url(#glow)"/>
    <text x="40" y="54" font-family="monospace" font-size="36" font-weight="800" fill="#000" text-anchor="middle" dominant-baseline="middle">$</text>
  </g>
  
  <text x="180" y="110" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        font-size="48" font-weight="800" fill="${TEXT}" letter-spacing="-1px" max-width="960">
    ${title}
  </text>
  
  ${makeBadge(badgeText, badgeColor)}
  
  <text x="60" y="220" font-family="system-ui, sans-serif" 
        font-size="26" fill="${TEXT_DIM}" letter-spacing="0.2px">
    ${description}
  </text>
  
  <line x1="60" y1="320" x2="1140" y2="320" stroke="#222" stroke-width="1"/>
  
  <g transform="translate(60, 360)">
    <text x="0" y="0" font-family="system-ui, sans-serif" font-size="20" fill="${TEXT_DIM}">staryi441.dev</text>
    <text x="0" y="35" font-family="monospace" font-size="16" fill="${ACCENT}">github.com/staryi441</text>
    <text x="0" y="70" font-family="monospace" font-size="16" fill="${TEXT_DIM}">tg: @staryi441</text>
  </g>
  
  <line x1="0" y1="${HEIGHT}" x2="${WIDTH}" y2="${HEIGHT}" stroke="${ACCENT}" stroke-width="4"/>
  
  <path d="M 1140 590 L 1140 630 L 1100 630" stroke="${ACCENT}" stroke-width="3" fill="none" opacity="0.5"/>
  <path d="M 60 0 L 60 40 L 100 40" stroke="${ACCENT}" stroke-width="3" fill="none" opacity="0.5"/>
</svg>`;
}

async function generate(svg, filename) {
  const outPath = path.join(OUT_DIR, filename);
  await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`OK ${filename}`);
}

async function main() {
  // Default / index - NO ampersand in description
  await generate(makeSvg({
    title: 'Staryi Dev Hub',
    description: 'Системное администрирование и Разработка приложений. Android, Kotlin, C#, .NET, Python, Go, DIY электроника, VPN, AI.',
    badgeText: 'Portfolio',
    badgeColor: ACCENT,
  }), 'index.png');

  const projectConfigs = [
    { slug: 'worktracker', title: 'WorkTracker', desc: 'Android-приложение для учета рабочих смен, расчета заработной платы и фото-заметок.', badge: 'Android App', color: ACCENT },
    { slug: 'recoveryparser', title: 'RecoveryParser', desc: 'Консольная утилита для анализа Android-образов recovery/vendor_boot. Мгновенная декомпрессия.', badge: 'CLI Utility', color: INFO },
    { slug: 'netchecker', title: 'NetChecker', desc: 'Консольная утилита на .NET для комплексной проверки сетевых ресурсов и анализа блокировок.', badge: 'CLI Utility', color: SUCCESS },
  ];

  for (const p of projectConfigs) {
    await generate(makeSvg({
      title: p.title,
      description: p.desc,
      badgeText: p.badge,
      badgeColor: p.color,
    }), `project-${p.slug}.png`);
  }

  await generate(makeSvg({
    title: 'AI Skills Hub',
    description: 'Систематизированный сборник практик, промпт-инжиниринга и интеграции локальных и облачных нейросетей.',
    badgeText: 'Knowledge Base',
    badgeColor: HUB,
  }), 'ai-skills.png');

  const skillConfigs = [
    { slug: 'design', title: 'AI Design and Art', desc: 'Генерация интерфейсов, концепт-артов, текстур и управление диффузионными моделями.', badge: 'Generative Art', color: ACCENT },
    { slug: 'video-generation', title: 'Video and Motion', desc: 'Создание бесшовных видеороликов, анимация статичных изображений через Sora, Runway, Luma.', badge: 'Video Gen', color: ACCENT_LIGHT },
    { slug: 'ai-dev', title: 'LLM Integration', desc: 'Подключение API локальных и облачных моделей, построение ИИ-ассистентов и MCP-серверов.', badge: 'Dev and Auto', color: SUCCESS },
    { slug: 'prompting', title: 'Advanced Prompting', desc: 'Техники Chain-of-Thought, Few-Shot, управление контекстными окнами и системными промптами.', badge: 'Prompt Eng', color: INFO },
  ];

  for (const s of skillConfigs) {
    await generate(makeSvg({
      title: s.title,
      description: s.desc,
      badgeText: s.badge,
      badgeColor: s.color,
    }), `skill-${s.slug}.png`);
  }

  console.log('\nAll OG images generated in src/assets/images/og/');
}

main().catch(console.error);