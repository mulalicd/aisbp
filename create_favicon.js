const fs = require('fs');
const path = require('path');

const faviconPath = path.join(__dirname, 'frontend/public/favicon.png'); // Adjust path as needed

// A minimal 1x1 transparent PNG base64 decoded
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
const buffer = Buffer.from(base64Png, 'base64');

try {
    fs.writeFileSync('C:\\PRIVATE\\AI\\AISBS\\frontend\\public\\favicon.png', buffer);
    console.log('Favicon created successfully.');
} catch (err) {
    console.error('Error creating favicon:', err);
}
