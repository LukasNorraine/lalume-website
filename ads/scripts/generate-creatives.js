/**
 * LaLume Ad Creative Generator
 * Exports all HTML creative templates to PNG at exact Meta Ads specs.
 *
 * Setup:  npm install
 * Run:    node generate-creatives.js
 * Output: ads/exports/*.png — ready to upload to Meta Ads Manager
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const CREATIVES_DIR = path.resolve(__dirname, '../creatives');
const EXPORTS_DIR = path.resolve(__dirname, '../exports');

const CREATIVES = [
  // TOF Cold — Feed 1:1
  { file: 'cold-1-problem-hook.html',  width: 1080, height: 1080, name: 'TOF_cold_problem-hook_1x1' },
  { file: 'cold-2-ingredient-proof.html', width: 1080, height: 1080, name: 'TOF_cold_ingredient-proof_1x1' },
  { file: 'cold-3-canadian-skin.html', width: 1080, height: 1080, name: 'TOF_cold_canadian-skin_1x1' },
  // TOF Cold — Story/Reels 9:16
  { file: 'cold-4-story.html',         width: 1080, height: 1920, name: 'TOF_cold_story_9x16' },
  // MOF Warm
  { file: 'warm-1-testimonial.html',   width: 1080, height: 1080, name: 'MOF_warm_testimonial_1x1' },
  // BOF Hot — Feed
  { file: 'hot-1-urgency-offer.html',  width: 1080, height: 1080, name: 'BOF_hot_urgency-offer_1x1' },
  // BOF Hot — Story
  { file: 'hot-2-story.html',          width: 1080, height: 1920, name: 'BOF_hot_retarget-story_9x16' },
];

async function generateCreatives() {
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  const results = [];

  for (const creative of CREATIVES) {
    const filePath = path.join(CREATIVES_DIR, creative.file);
    const outputPath = path.join(EXPORTS_DIR, `${creative.name}.png`);

    console.log(`\nRendering: ${creative.name}`);

    const page = await browser.newPage();

    await page.setViewport({
      width: creative.width,
      height: creative.height,
      deviceScaleFactor: 1,
    });

    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

    // Wait for Google Fonts to load
    await page.waitForFunction(() => document.fonts.ready);
    await page.waitForTimeout(500);

    await page.screenshot({
      path: outputPath,
      fullPage: false,
      clip: { x: 0, y: 0, width: creative.width, height: creative.height },
    });

    await page.close();

    const stat = fs.statSync(outputPath);
    console.log(`  Saved: ${outputPath} (${(stat.size / 1024).toFixed(0)} KB)`);
    results.push({ name: creative.name, path: outputPath, size: stat.size });
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`Generated ${results.length} creatives in: ${EXPORTS_DIR}`);
  console.log('========================================');
  console.log('\nMeta Ads upload specs:');
  console.log('  Feed (1:1):      1080x1080px — Images');
  console.log('  Story (9:16):    1080x1920px — Stories & Reels');
  console.log('\nNaming convention:');
  console.log('  TOF_* = Top of Funnel (cold audiences)');
  console.log('  MOF_* = Middle of Funnel (warm audiences)');
  console.log('  BOF_* = Bottom of Funnel (hot retarget)');
  console.log('\nNext step: run "node meta-campaign-setup.js" to build campaigns in Ads Manager.');
}

generateCreatives().catch((err) => {
  console.error('Creative generation failed:', err);
  process.exit(1);
});
