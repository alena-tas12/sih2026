const fs = require('fs');
let schema = fs.readFileSync('apps/api/schema.sql', 'utf8');

if (!schema.includes('image_source')) {
  schema = schema.replace('image_url TEXT,', 'image_url TEXT,\n  image_source TEXT,\n  image_source_url TEXT,\n  image_license TEXT,');
  fs.writeFileSync('apps/api/schema.sql', schema);
  console.log("Schema updated with image source fields.");
}
