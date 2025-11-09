// Helper script to convert db.json for MockAPI.io
// Run: node convert-for-mockapi.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read db.json
const dbPath = path.join(__dirname, 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Convert restaurants (remove id field - MockAPI will auto-generate)
const restaurantsForMockAPI = dbData.restaurants.map(({ id, ...restaurant }) => ({
  ...restaurant,
  // Keep menu items as is (they can have ids)
}));

// Convert cuisines (remove id field)
const cuisinesForMockAPI = dbData.cuisines.map(({ id, ...cuisine }) => ({
  ...cuisine,
}));

// Create output files
const outputDir = path.join(__dirname, 'mockapi-data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write restaurants data
fs.writeFileSync(
  path.join(outputDir, 'restaurants.json'),
  JSON.stringify(restaurantsForMockAPI, null, 2)
);

// Write cuisines data
fs.writeFileSync(
  path.join(outputDir, 'cuisines.json'),
  JSON.stringify(cuisinesForMockAPI, null, 2)
);

console.log('✅ Converted data for MockAPI.io!');
console.log(`📁 Output files:`);
console.log(`   - ${outputDir}/restaurants.json`);
console.log(`   - ${outputDir}/cuisines.json`);
console.log(`\n📋 Next steps:`);
console.log(`   1. Go to MockAPI.io and create a project`);
console.log(`   2. Create a resource called "restaurants"`);
console.log(`   3. Import the contents of ${outputDir}/restaurants.json`);
console.log(`   4. Create a resource called "cuisines"`);
console.log(`   5. Import the contents of ${outputDir}/cuisines.json`);
console.log(`\n💡 Tip: Copy the JSON content and paste it into MockAPI.io's import field`);

