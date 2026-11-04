import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '../web/public/wardrobe');

const PERSONAS_DATA = {
  women: [
    { name: 'women_dress_champagne.jpg', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_tuxedo_suit.jpg', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_sundress_floral.jpg', url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_velvet_gown.jpg', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_match_1.jpg', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_match_2.jpg', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_match_3.jpg', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_match_4.jpg', url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_mismatch_1.jpg', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_mismatch_2.jpg', url: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_mismatch_3.jpg', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
    { name: 'women_mismatch_4.jpg', url: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=800&q=80' }
  ],
  man: [
    { name: 'man_suit_charcoal.jpg', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_tuxedo_blacktie.jpg', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_casual_cashmere.jpg', url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_linen_resort.jpg', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_match_1.jpg', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_match_2.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_match_3.jpg', url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_match_4.jpg', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_mismatch_1.jpg', url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_mismatch_2.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_mismatch_3.jpg', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80' },
    { name: 'man_mismatch_4.jpg', url: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=800&q=80' }
  ],
  boy: [
    { name: 'boy_blazer_navy.jpg', url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_nautical_breton.jpg', url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_sweater_cable.jpg', url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_linen_summer.jpg', url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca564?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_match_1.jpg', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_match_2.jpg', url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_match_3.jpg', url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_match_4.jpg', url: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_mismatch_1.jpg', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_mismatch_2.jpg', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_mismatch_3.jpg', url: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=800&q=80' },
    { name: 'boy_mismatch_4.jpg', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80' }
  ],
  girl: [
    { name: 'girl_dress_gingham.jpg', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_dress_floral.jpg', url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_dress_pinafore.jpg', url: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_dress_velvet.jpg', url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_match_1.jpg', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_match_2.jpg', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_match_3.jpg', url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_match_4.jpg', url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_mismatch_1.jpg', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_mismatch_2.jpg', url: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_mismatch_3.jpg', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
    { name: 'girl_mismatch_4.jpg', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80' }
  ]
};

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
}

async function run() {
  console.log('Downloading curated wardrobe assets for Women, Man, Boy, and Girl...');
  for (const [persona, items] of Object.entries(PERSONAS_DATA)) {
    const dir = path.join(BASE_DIR, persona);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Processing persona: ${persona} (${items.length} images)...`);
    for (const item of items) {
      const dest = path.join(dir, item.name);
      try {
        await downloadFile(item.url, dest);
        console.log(`  ✓ Saved: ${persona}/${item.name}`);
      } catch (err) {
        console.warn(`  ! Failed ${item.name}: ${err.message}`);
      }
    }
  }
  console.log('All persona wardrobe imagery downloaded successfully!');
}

run().catch(console.error);
