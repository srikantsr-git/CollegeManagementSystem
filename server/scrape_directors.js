const fs = require('fs');
const path = require('path');

const contentPath = 'C:/Users/91701/.gemini/antigravity-ide/brain/cddbe200-c4d8-447e-a997-2a59af9074c3/.system_generated/steps/667/content.md';
const html = fs.readFileSync(contentPath, 'utf8');

// Find all <tr> blocks case-insensitively, handling optional spaces/attributes
const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
let match;
const directors = [];
let sortOrder = 1;

while ((match = trRegex.exec(html)) !== null) {
  const trContent = match[1];
  
  // Extract td contents
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const tds = [];
  let tdMatch;
  while ((tdMatch = tdRegex.exec(trContent)) !== null) {
    tds.push(tdMatch[1].trim());
  }

  if (tds.length >= 5) {
    // Check if this is the header row
    if (tds[0].includes('<strong>Name</strong>') || tds[0].includes('Name')) {
      continue; // Skip header
    }

    // 1. Name
    const nameMatch = tds[0].replace(/<[^>]*>/g, '').trim();
    const name = nameMatch.replace(/\s+/g, ' ');

    // 2. Photo
    let photo_url = '';
    const imgMatch = /<img[^>]*src=["']([^"']+)["']/i.exec(tds[1]);
    if (imgMatch) {
      const src = imgMatch[1];
      if (!src.includes('blank.jpg')) {
        if (src.startsWith('http')) {
          photo_url = src;
        } else {
          photo_url = 'https://pczsc.in/pczsc-data_files/' + src.replace(/^\.\.\//, '');
        }
      }
    }

    // 3. Mobile Number
    const mobile_number = tds[2].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');

    // 4. Email
    const email = tds[3].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');

    // 5. College / Institute Name & Address
    const collegeFull = tds[4].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
    
    let college_name = collegeFull;
    let college_address = '';
    const commaIndex = collegeFull.lastIndexOf(',');
    if (commaIndex !== -1) {
      college_name = collegeFull.substring(0, commaIndex).trim();
      college_address = collegeFull.substring(commaIndex + 1).trim();
    }

    directors.push({
      name,
      photo_url,
      mobile_number,
      email,
      college_name,
      college_address,
      sort_order: sortOrder++
    });
  }
}

fs.writeFileSync('directors.json', JSON.stringify(directors, null, 2));
console.log(`Successfully parsed ${directors.length} directors.`);
directors.forEach(d => console.log(`${d.sort_order}. ${d.name}`));
