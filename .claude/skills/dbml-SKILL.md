---
name: dbml
description: Create, edit, validate, convert, and visualize database schemas using DBML (Database Markup Language). Use when users want to design database structures, convert between DBML and SQL (PostgreSQL, MySQL, MSSQL, Oracle, Snowflake), generate DBML from existing databases, create database diagrams, document database schemas, or work with database models in a human-readable format. DBML is ideal for database design, documentation, and communication between teams.
---

# DBML (Database Markup Language) Skill

This skill helps you work with DBML, a simple, readable DSL for defining database structures.

## When to Use This Skill

Use this skill when the user wants to:
- **Design database schemas** - Create new database structures from scratch
- **Convert formats** - Transform between DBML and SQL (PostgreSQL, MySQL, MSSQL, Oracle, Snowflake)
- **Reverse engineer** - Generate DBML from existing SQL DDL scripts
- **Document databases** - Create readable database documentation
- **Visualize schemas** - Prepare schemas for visualization on dbdiagram.io
- **Model relationships** - Define and visualize table relationships
- **Create diagrams** - Generate database entity-relationship diagrams

## Core Capabilities

### 1. Creating DBML Files

When creating DBML files:
- Start with Project definition if it's a complete database schema
- Define schemas for logical organization
- Create tables with appropriate column types and constraints
- Add relationships between tables
- Include notes for documentation
- Use enums for columns with fixed value sets
- Group related tables with TableGroups

### 2. Converting Between Formats

**DBML to SQL:**
```bash
# Always specify the target database
dbml2sql schema.dbml --postgres -o schema.sql
dbml2sql schema.dbml --mysql -o schema.sql
dbml2sql schema.dbml --mssql -o schema.sql
dbml2sql schema.dbml --oracle -o schema.sql
```

**SQL to DBML:**
```bash
# Specify the source database dialect
sql2dbml dump.sql --postgres -o schema.dbml
sql2dbml dump.sql --mysql -o schema.dbml
sql2dbml dump.sql --mssql -o schema.dbml
sql2dbml dump.sql --snowflake -o schema.dbml
```

### 3. Validating DBML

Before converting or sharing DBML:
1. Check syntax (proper use of `{}`, `[]`, quotes)
2. Verify all referenced tables exist in relationships
3. Ensure column names in relationships match table definitions
4. Validate enum references
5. Check for proper schema prefixes

## DBML Syntax Quick Reference

### Project Definition
```dbml
Project project_name {
  database_type: 'PostgreSQL'
  Note: 'Description of the project'
}
```

### Table Definition
```dbml
Table users {
  id integer [pk, increment]
  username varchar(255) [not null, unique]
  email varchar(255) [not null, unique]
  created_at timestamp [default: `now()`]
  
  indexes {
    email [unique]
    (username, email) [name: 'user_search_idx']
  }
  
  Note: 'Stores user account information'
}
```

### Relationships
```dbml
// Many-to-one
Ref: posts.user_id > users.id

// One-to-many
Ref: users.id < posts.user_id

// One-to-one
Ref: users.id - user_profiles.user_id

// Many-to-many
Ref: authors.id <> books.id

// With settings
Ref: orders.user_id > users.id [delete: cascade, update: no action]
```

### Enums
```dbml
enum user_role {
  admin
  moderator
  user [note: 'Default role']
}

Table users {
  role user_role [default: 'user']
}
```

### Table Partials (Reusable Components)
```dbml
TablePartial base_fields {
  id integer [pk, increment]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table users {
  ~base_fields
  username varchar(255) [not null]
  email varchar(255) [not null]
}

Table posts {
  ~base_fields
  title varchar(255) [not null]
  content text
}
```

### TableGroups
```dbml
TableGroup user_management [color: #3498DB] {
  users
  user_profiles
  user_sessions
}
```

### Column Settings
- `pk` or `primary key`: Primary key
- `not null`: Non-nullable
- `unique`: Unique constraint
- `increment`: Auto-increment
- `default: value`: Default value
- `note: 'text'`: Documentation
- `` check: `expression` ``: Check constraint

### Index Settings
- `pk`: Primary key
- `unique`: Unique index
- `type: hash` or `type: btree`: Index type
- `name: 'index_name'`: Custom name

## Best Practices

### 1. Organization
- Use schemas to logically separate concerns (e.g., `core.users`, `auth.sessions`)
- Group related tables with TableGroups
- Use TablePartials for common fields (timestamps, soft deletes)

### 2. Documentation
- Add Project notes for overview
- Include table notes to explain purpose
- Document complex columns with notes
- Use meaningful enum value notes

### 3. Relationships
- Always specify the correct cardinality (`<`, `>`, `-`, `<>`)
- Add referential actions for clarity (`delete: cascade`, `update: restrict`)
- Use descriptive relationship names for complex cases

### 4. Naming Conventions
- Use snake_case for tables and columns
- Use singular names for tables (e.g., `user`, not `users`)
- Prefix foreign keys with table name (e.g., `user_id`)
- Use descriptive enum values

### 5. Data Types
- Use appropriate precision for decimals: `decimal(10,2)`
- Specify varchar lengths: `varchar(255)`
- Use `text` for long-form content
- Consider using enums instead of varchar for fixed value sets

## Common Workflows

### Creating a New Database Schema

1. **Start with project definition:**
```dbml
Project ecommerce_db {
  database_type: 'PostgreSQL'
  Note: '''
  E-commerce platform database
  Version: 1.0
  '''
}
```

2. **Define base partials:**
```dbml
TablePartial timestamps {
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

TablePartial soft_delete {
  deleted_at timestamp [null]
}
```

3. **Create core tables:**
```dbml
Table users {
  ~timestamps
  id integer [pk, increment]
  email varchar(255) [not null, unique]
  password_hash varchar(255) [not null]
}

Table products {
  ~timestamps
  ~soft_delete
  id integer [pk, increment]
  name varchar(255) [not null]
  price decimal(10,2) [not null]
  stock integer [default: 0]
}
```

4. **Add relationships:**
```dbml
Table orders {
  ~timestamps
  id integer [pk, increment]
  user_id integer [not null, ref: > users.id]
  total decimal(10,2) [not null]
  status order_status [default: 'pending']
}

enum order_status {
  pending
  processing
  shipped
  delivered
  cancelled
}
```

5. **Group tables:**
```dbml
TableGroup core [color: #3498DB] {
  users
  products
  orders
}
```

### Converting Existing SQL to DBML

1. **Save your SQL DDL to a file**
2. **Run conversion:**
```bash
sql2dbml schema.sql --postgres -o schema.dbml
```
3. **Review and enhance** - Add notes, organize with groups, add colors
4. **Validate** - Check for any conversion issues

### Generating SQL from DBML

1. **Ensure DBML is valid**
2. **Convert to target database:**
```bash
dbml2sql schema.dbml --postgres -o postgres.sql
dbml2sql schema.dbml --mysql -o mysql.sql
```
3. **Review generated SQL** - Check for any database-specific adjustments needed

## Handling Complex Scenarios

### Multi-Schema Databases
```dbml
// Auth schema
Table auth.users {
  id integer [pk]
  email varchar(255)
}

// Main schema  
Table public.posts {
  id integer [pk]
  author_id integer [ref: > auth.users.id]
}
```

### Composite Keys
```dbml
Table order_items {
  order_id integer
  product_id integer
  quantity integer
  
  indexes {
    (order_id, product_id) [pk]
  }
}

Ref: order_items.(order_id, product_id) > orders.(id, version)
```

### Self-Referential Relationships
```dbml
Table employees {
  id integer [pk]
  name varchar(255)
  manager_id integer [ref: > employees.id, null]
}
```

### Check Constraints
```dbml
Table products {
  id integer [pk]
  price decimal(10,2)
  discount_price decimal(10,2)
  
  checks {
    `discount_price < price` [name: 'valid_discount']
    `price > 0` [name: 'positive_price']
  }
}
```

## Common Pitfalls to Avoid

1. **Missing schema prefixes** - Always be explicit about schemas
2. **Incorrect relationship symbols** - Remember: `>` is many-to-one, `<` is one-to-many
3. **Forgetting quotes** - String defaults need single quotes: `default: 'active'`
4. **Wrong backtick usage** - Use backticks for expressions: `` default: `now()` ``
5. **Circular references** - Design relationships carefully to avoid cycles
6. **Undefined enums** - Define enums before using them in tables
7. **Invalid column references** - Ensure all columns exist in relationship definitions

## Output Guidelines

When creating DBML files:
1. **Save to `/mnt/user-data/outputs/`** so users can access them
2. **Use `.dbml` extension** for proper recognition
3. **Include comprehensive notes** for documentation
4. **Add visual elements** (colors, groups) for better diagrams
5. **Validate syntax** before saving

When converting formats:
1. **Always specify the database dialect** explicitly
2. **Save both input and output files** for user reference
3. **Report any conversion warnings** or limitations
4. **Provide next steps** (e.g., "You can now import this SQL into PostgreSQL")

For full reference documentation check ./LLMS/dbml-llm.txt

## Summary

This skill provides comprehensive DBML support for:
- Creating readable database schemas
- Converting between DBML and multiple SQL dialects
- Documenting database structures
- Generating database diagrams
- Modeling complex relationships
