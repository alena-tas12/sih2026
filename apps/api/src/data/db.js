const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let db;

async function initDb() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      gtin TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT,
      vendor TEXT,
      mrp REAL,
      netQuantity TEXT,
      manufacturerAddress TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inspections (
      id TEXT PRIMARY KEY,
      gtin TEXT NOT NULL,
      location TEXT NOT NULL,
      extractedMrp REAL,
      extractedQty TEXT,
      extractedMfgDate TEXT,
      extractedExpDate TEXT,
      status TEXT NOT NULL,
      reviewDecision TEXT,
      reviewerNotes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (gtin) REFERENCES products(gtin)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed initial data if empty
  const count = await db.get('SELECT COUNT(*) as c FROM products');
  if (count.c === 0) {
    await db.run(`
      INSERT INTO products (gtin, name, brand, vendor, mrp, netQuantity, manufacturerAddress) 
      VALUES ('8901030985223', 'Premium Basmati Rice', 'ABC Foods', 'Verified FMCG Vendor', 150.00, '500 g', 'ABC Foods India Pvt Ltd, Delhi')
    `);
    await db.run(`
      INSERT INTO inspections (id, gtin, location, extractedMrp, extractedQty, status, createdAt)
      VALUES 
        ('CASE-101', '8901030985223', 'Coimbatore Hub', 150.00, '500 g', 'COMPLIANT', '2026-09-05T11:00:00Z'),
        ('CASE-102', '8901030985223', 'Chennai Hub', 150.00, '500 g', 'COMPLIANT', '2026-09-08T09:15:00Z')
    `);
  }

  const settingsCount = await db.get('SELECT COUNT(*) as c FROM settings');
  if (settingsCount.c === 0) {
    await db.run(`INSERT INTO settings (key, value) VALUES ('autoApprove', '85')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('humanReview', '60')`);
    await db.run(`INSERT INTO settings (key, value) VALUES ('haltContradiction', 'true')`);
  }
}

function getDb() {
  return db;
}

module.exports = { initDb, getDb };
