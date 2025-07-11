# Database Scripts

This directory contains scripts for managing the database in the DevHire application.

## Available Scripts

### 1. Create Admin User (`createAdmin.js`)

This script will:
- Interactively prompt for admin user details
- Check if email already exists
- Create a new admin user with proper role and verification
- Safe to run on existing databases

**Usage:**
```bash
# From the backend directory
bun run admin:create
```

**Interactive Prompts:**
- Admin name
- Admin email (must be unique)
- Admin password
- Admin location (optional)
- Admin bio (optional)

### 2. Reset Database (`resetDatabase.js`)

This script will:
- Drop all existing tables
- Recreate all tables with the latest schema
- Create a single admin user

**Usage:**
```bash
# From the backend directory
bun run db:reset
```

**Admin Credentials Created:**
- Email: `admin@devhire.com`
- Password: `admin123`
- Role: `admin`

### 3. Seed Database (`seedDatabase.js`)

This script will:
- Create sample users (admin, client, developers)
- Create sample jobs, job requests, and projects
- Create sample proposals and notifications
- Useful for development and testing

**Usage:**
```bash
# From the backend directory
bun run db:seed
```

**Sample Accounts Created:**
- **Admin:** admin@devhire.com / admin123
- **Client:** client@example.com / client123
- **Developer 1:** developer@example.com / dev123
- **Developer 2:** mike@example.com / mike123

## Important Notes

⚠️ **Warning:** Both scripts will modify your database. Make sure you have backups if needed.

- The reset script completely destroys all existing data
- The seed script assumes an empty database (run reset first)
- Make sure your database connection is properly configured in `config/database.js`
- Ensure your PostgreSQL server is running before executing these scripts

## Typical Workflow

1. **Fresh Start:** Run reset script to clean everything
   ```bash
   bun run db:reset
   ```

2. **Development Setup:** Run seed script for sample data
   ```bash
   bun run db:seed
   ```

3. **Production Setup:** Run reset script, then create admin users
   ```bash
   bun run db:reset
   bun run admin:create
   ```

4. **Add Additional Admins:** Use the admin creation script anytime
   ```bash
   bun run admin:create
   ```

## Troubleshooting

If you encounter errors:

1. **Database Connection Issues:**
   - Verify PostgreSQL is running
   - Check database credentials in `.env` file
   - Ensure database exists

2. **Permission Issues:**
   - Make sure the database user has CREATE/DROP permissions
   - Check if tables are locked by other connections

3. **Model Issues:**
   - Ensure all models are properly imported
   - Check for circular dependencies in model associations

For more help, check the console output for specific error messages.