# Database Schema

Database schema and migrations for the Genesis Compliance system.

## Installation

```bash
npm install @genesis-compliance/database
```

## Schema

The `schema.sql` file contains the complete database schema for the Genesis Compliance system.

## Usage

Apply the schema to your database:

```bash
# Using sqlite
sqlite3 compliance.db < schema.sql

# Using MySQL
mysql -u user -p database < schema.sql

# Using PostgreSQL
psql -U user -d database -f schema.sql
```

## Tables

The schema includes tables for:

- Compliance rules
- Evidence collection
- Audit logs
- User management
- System configuration

## License

MIT
