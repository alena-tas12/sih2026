-- Phase 1: Core Database Schema

-- Users and Organisations
CREATE TABLE organisations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    organisation_id INTEGER REFERENCES organisations(id),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    organisation_id INTEGER REFERENCES organisations(id),
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regulations and Rules
CREATE TABLE regulations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(50) NOT NULL
);

CREATE TABLE rule_versions (
    id SERIAL PRIMARY KEY,
    regulation_id INTEGER REFERENCES regulations(id),
    version_string VARCHAR(50) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE
);

CREATE TABLE requirements (
    id SERIAL PRIMARY KEY,
    rule_version_id INTEGER REFERENCES rule_versions(id),
    field_name VARCHAR(100) NOT NULL,
    requirement_type VARCHAR(50) NOT NULL, -- PRESENCE, FORMAT, NUMERIC
    severity VARCHAR(50) NOT NULL
);

-- Cases and Evidence
CREATE TABLE compliance_cases (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    organisation_id INTEGER REFERENCES organisations(id),
    status VARCHAR(50) NOT NULL, -- UPLOADED, OCR_PROCESSING, EVALUATION, REVIEW_REQUIRED, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE uploaded_images (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES compliance_cases(id),
    file_path VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) -- FRONT, BACK, SIDE
);

CREATE TABLE ocr_regions (
    id SERIAL PRIMARY KEY,
    image_id INTEGER REFERENCES uploaded_images(id),
    bounding_box JSONB NOT NULL,
    raw_text TEXT,
    confidence NUMERIC(4,3)
);

CREATE TABLE extracted_fields (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES compliance_cases(id),
    ocr_region_id INTEGER REFERENCES ocr_regions(id),
    field_name VARCHAR(100) NOT NULL,
    normalised_value JSONB,
    confidence NUMERIC(4,3)
);

CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES compliance_cases(id),
    requirement_id INTEGER REFERENCES requirements(id),
    extracted_field_id INTEGER REFERENCES extracted_fields(id),
    result VARCHAR(50) NOT NULL, -- PASS, FAIL, NEEDS_REVIEW
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE review_actions (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES compliance_cases(id),
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- ACCEPT, CORRECT, REJECT
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
