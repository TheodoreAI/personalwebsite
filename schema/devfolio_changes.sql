-- When adding new columns to the database use the following:
-- ALTER TABLE customers 
-- ADD COLUMN phone VARCHAR;

-- Example for 'about' data table
ALTER TABLE 
    about
ADD 
    COLUMN title VARCHAR(200);
