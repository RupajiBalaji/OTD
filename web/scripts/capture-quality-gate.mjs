import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = 'C:/Users/rupaj/.gemini/antigravity/brain/d6507e1a-77da-4a05-bfbd-ad2fdf0c9026/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Edge for Quality Gate screenshots...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:5173/?quality-gate=true ...');
  await page.goto('http://localhost:5173/?quality-gate=true', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const outfitNames = [
    '01-jeans-tee-sneakers',
    '02-formal-suit',
    '03-kurta',
    '04-saree',
    '05-printed-shirt',
    '06-hoodie-slippers',
  ];

  // 1. Capture each outfit in Light mode
  for (let i = 0; i < outfitNames.length; i++) {
    console.log(`Selecting outfit #${i}: ${outfitNames[i]} (Light Mode)`);
    await page.click(`#select-outfit-${i}`);
    await page.waitForTimeout(600);

    const card = await page.$('#character-stage-card');
    if (card) {
      const outputPath = path.join(SCREENSHOT_DIR, `${outfitNames[i]}-light.png`);
      await card.screenshot({ path: outputPath });
      console.log(`Saved: ${outputPath}`);
    }
  }

  // 2. Capture all six comparison in Light mode
  const allSixLight = await page.$('#all-six-grid');
  if (allSixLight) {
    const allSixPath = path.join(SCREENSHOT_DIR, '00-all-six-outfits-light.png');
    await allSixLight.screenshot({ path: allSixPath });
    console.log(`Saved: ${allSixPath}`);
  }

  // 3. Switch to Dark Mode
  console.log('Switching to Dark Mode...');
  await page.click('#toggle-dark-mode');
  await page.waitForTimeout(600);

  // 4. Capture each outfit in Dark mode
  for (let i = 0; i < outfitNames.length; i++) {
    console.log(`Selecting outfit #${i}: ${outfitNames[i]} (Dark Mode)`);
    await page.click(`#select-outfit-${i}`);
    await page.waitForTimeout(600);

    const card = await page.$('#character-stage-card');
    if (card) {
      const outputPath = path.join(SCREENSHOT_DIR, `${outfitNames[i]}-dark.png`);
      await card.screenshot({ path: outputPath });
      console.log(`Saved: ${outputPath}`);
    }
  }

  // 5. Capture all six comparison in Dark mode
  const allSixDark = await page.$('#all-six-grid');
  if (allSixDark) {
    const allSixPath = path.join(SCREENSHOT_DIR, '00-all-six-outfits-dark.png');
    await allSixDark.screenshot({ path: allSixPath });
    console.log(`Saved: ${allSixPath}`);
  }

  await browser.close();
  console.log('Quality Gate screen capture completed successfully.');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
