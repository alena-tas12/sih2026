PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS audit_events;
DROP TABLE IF EXISTS comparisons;
DROP TABLE IF EXISTS observations;
DROP TABLE IF EXISTS extractions;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS inspections;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS gtin_registry;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS rules;
DROP TABLE IF EXISTS regulations;
DROP TABLE IF EXISTS settings;

PRAGMA foreign_keys = ON;

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  vendor TEXT,
  standard_mrp REAL,
  net_quantity TEXT,
  manufacturer_address TEXT,
  image_url TEXT,
  image_source TEXT,
  image_source_url TEXT,
  image_license TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gtin_registry (
  gtin TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  source TEXT NOT NULL,
  verified BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  last_counted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  region TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inspections (
  id TEXT PRIMARY KEY,
  gtin TEXT NOT NULL,
  location_id TEXT NOT NULL,
  status TEXT NOT NULL,
  review_decision TEXT,
  reviewer_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

CREATE TABLE evidence (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inspection_id) REFERENCES inspections(id)
);

CREATE TABLE extractions (
  id TEXT PRIMARY KEY,
  evidence_id TEXT NOT NULL,
  raw_text TEXT,
  parsed_mrp REAL,
  parsed_batch TEXT,
  parsed_exp_date TEXT,
  confidence REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evidence_id) REFERENCES evidence(id)
);

CREATE TABLE observations (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL,
  field_key TEXT NOT NULL,
  verified_value TEXT NOT NULL,
  verified_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inspection_id) REFERENCES inspections(id)
);

CREATE TABLE comparisons (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL,
  matched BOOLEAN NOT NULL,
  differences TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inspection_id) REFERENCES inspections(id)
);

CREATE TABLE audit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regulations (
  id TEXT PRIMARY KEY,
  act_name TEXT NOT NULL,
  url TEXT
);

CREATE TABLE rules (
  id TEXT PRIMARY KEY,
  regulation_id TEXT,
  rule_section TEXT NOT NULL,
  field_target TEXT NOT NULL,
  logical_constraint TEXT,
  FOREIGN KEY (regulation_id) REFERENCES regulations(id)
);

-- Seed Data

INSERT INTO locations (id, name, type, region) VALUES 
('LOC-BLR', 'Bangalore Hub', 'WAREHOUSE', 'South'),
('LOC-MAA', 'Chennai Hub', 'DISTRIBUTION', 'South'),
('LOC-CJB', 'Coimbatore Hub', 'WAREHOUSE', 'South');

INSERT INTO products (id, name, brand, vendor, standard_mrp, net_quantity, manufacturer_address, image_url) VALUES 
('PROD-001', 'Premium Basmati Rice', 'ABC Foods', 'Verified FMCG Vendor', 150.00, '500 g', 'ABC Foods India Pvt Ltd, Delhi', 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&q=80'),
('PROD-002', 'ABC Tomato Ketchup', 'ABC Foods', 'Verified FMCG Vendor', 120.00, '1 kg', 'ABC Foods India Pvt Ltd, Delhi', 'https://images.unsplash.com/photo-1606240212002-3932780ff257?w=500&q=80');

INSERT INTO gtin_registry (gtin, product_id, source, verified) VALUES 
('8901030985223', 'PROD-001', 'GS1_INDIA', 1),
('8901030985224', 'PROD-002', 'GS1_INDIA', 1);

INSERT INTO inventory (product_id, location_id, quantity) VALUES
('PROD-001', 'LOC-BLR', 1450),
('PROD-001', 'LOC-MAA', 890),
('PROD-002', 'LOC-BLR', 3200);

INSERT INTO regulations (id, act_name, url) VALUES
('REG-LMPC-2011', 'Legal Metrology (Packaged Commodities) Rules, 2011', 'https://consumeraffairs.gov.in/pages/legal-metrology-act-and-the-legal-metrology-packaged-commodities-rules-2011');

INSERT INTO rules (id, regulation_id, rule_section, field_target, logical_constraint) VALUES
('RULE-LMPC-01', 'REG-LMPC-2011', 'Rule 6(1)(a) - Name & Address', 'Manufacturer Address', 'EXISTS(value) AND length(value) > 10'),
('RULE-LMPC-02', 'REG-LMPC-2011', 'Rule 6(1)(b) - Generic Name', 'Product Name', 'EXISTS(value)'),
('RULE-LMPC-03', 'REG-LMPC-2011', 'Rule 6(1)(c) - Net Quantity', 'Net Quantity', 'value > 0 AND unit IN ("g","kg","ml","L","U")'),
('RULE-LMPC-04', 'REG-LMPC-2011', 'Rule 6(1)(d) - Mfg Month/Year', 'Batch/Date', 'MATCHES("\d{2}/\d{4}|\d{2}/\d{2}")'),
('RULE-LMPC-05', 'REG-LMPC-2011', 'Rule 6(1)(e) - MRP', 'MRP', 'value > 0 AND includes_text("incl. of all taxes")'),
('RULE-LMPC-06', 'REG-LMPC-2011', 'Rule 6(1)(g) - Consumer Care', 'Customer Support', 'MATCHES("email|phone|call")');

INSERT INTO inspections (id, gtin, location_id, status) VALUES 
('INS-PAST-1', '8901030985223', 'LOC-BLR', 'COMPLIANT');

INSERT INTO observations (id, inspection_id, field_key, verified_value, verified_by) VALUES 
('OBS-PAST-1', 'INS-PAST-1', 'MRP', '150.00', 'SYSTEM');
