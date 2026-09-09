DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS inspections;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  gtin TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  vendor TEXT,
  mrp REAL,
  netQuantity TEXT,
  manufacturerAddress TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inspections (
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

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  region TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evidence (
  id TEXT PRIMARY KEY,
  inspectionId TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inspectionId) REFERENCES inspections(id)
);

CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  targetId TEXT,
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data
INSERT INTO products (gtin, name, brand, vendor, mrp, netQuantity, manufacturerAddress) 
VALUES ('8901030985223', 'Premium Basmati Rice', 'ABC Foods', 'Verified FMCG Vendor', 150.00, '500 g', 'ABC Foods India Pvt Ltd, Delhi');

INSERT INTO inspections (id, gtin, location, extractedMrp, extractedQty, status, createdAt)
VALUES 
  ('CASE-101', '8901030985223', 'Coimbatore Hub', 150.00, '500 g', 'COMPLIANT', '2026-09-05T11:00:00Z'),
  ('CASE-102', '8901030985223', 'Chennai Hub', 150.00, '500 g', 'COMPLIANT', '2026-09-08T09:15:00Z');

INSERT INTO settings (key, value) VALUES ('autoApprove', '85');
INSERT INTO settings (key, value) VALUES ('humanReview', '60');
INSERT INTO settings (key, value) VALUES ('haltContradiction', 'true');

INSERT INTO locations (id, name, type, region) VALUES ('LOC-001', 'Coimbatore Hub', 'WAREHOUSE', 'South');
INSERT INTO locations (id, name, type, region) VALUES ('LOC-002', 'Chennai Hub', 'DISTRIBUTION', 'South');

INSERT INTO audit_logs (action, actor, targetId, details) VALUES ('SYSTEM_INIT', 'SYSTEM', 'DB', 'Database initialized and seeded');
