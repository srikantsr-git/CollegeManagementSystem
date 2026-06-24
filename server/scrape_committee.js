const https = require('https');

let html = '';

const options = {
  hostname: 'pczsc.in',
  path: '/pczsc-data_files/pczscCommittee.htm',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

https.get(options, (res) => {
  res.on('data', chunk => { html += chunk; });
  res.on('end', () => {
    // Extract table rows
    const rowMatches = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    const members = [];
    let sortOrder = 1;

    for (let i = 1; i < rowMatches.length; i++) {
      const row = rowMatches[i];
      const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
      if (cells.length < 4) continue;

      const getText = (h) => h
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#[0-9]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const name = getText(cells[0] || '');
      const designation = getText(cells[1] || '');
      const photoCell = cells[2] || '';
      const addrCell = getText(cells[3] || '');
      const contactCell = getText(cells[4] || '');

      // Extract photo src
      const photoMatch = photoCell.match(/src="([^"]+)"/i);
      let photoUrl = photoMatch ? photoMatch[1] : '';
      if (photoUrl && !photoUrl.startsWith('http')) {
        photoUrl = 'https://pczsc.in/pczsc-data_files/' + photoUrl.replace(/^\.\//, '');
      }

      // Skip header row and empty rows
      if (!name || name.length < 3 || !designation) continue;
      if (name.toLowerCase().includes('name') && designation.toLowerCase().includes('designation')) continue;

      // Try to parse college name vs address from address cell
      // Typically: "College Name, Address Line, City - Pincode"
      const addrParts = addrCell.split(',');
      const collegeName = addrParts[0] ? addrParts[0].trim() : '';
      const collegeAddress = addrParts.slice(1).join(',').trim();

      members.push({
        name,
        designation,
        photo_url: photoUrl,
        college_name: collegeName,
        college_address: collegeAddress,
        contact_details: contactCell,
        sort_order: sortOrder++
      });
    }

    console.log(JSON.stringify(members, null, 2));
    process.exit(0);
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
