-- Building the database with this file:
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS about;

-- Table for the about section of my webpage

CREATE TABLE about
(id BIGSERIAL PRIMARY KEY NOT NULL,
name VARCHAR(200) NOT NULL,
descript VARCHAR(500) NOT NULL);

-- Table for the admin
CREATE TABLE admins
(id BIGSERIAL PRIMARY KEY NOT NULL,
name VARCHAR(200) NOT NULL,
email VARCHAR(200) NOT NULL,
password VARCHAR(200) NOT NULL,
aboutid INTEGER REFERENCES about(id),
UNIQUE(email));


