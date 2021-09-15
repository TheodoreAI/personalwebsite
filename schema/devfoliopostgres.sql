-- Building the database with this file:
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS about;

-- Table for the about section of my webpage

CREATE TABLE about
(id BIGSERIAL PRIMARY KEY NOT NULL,
name VARCHAR(200) NOT NULL,
descript VARCHAR(1000) NOT NULL);

-- Table for the admin
CREATE TABLE admins
(id BIGSERIAL PRIMARY KEY NOT NULL,
name VARCHAR(200) NOT NULL,
email VARCHAR(200) NOT NULL,
password VARCHAR(200) NOT NULL,
aboutid INTEGER REFERENCES about(id),
UNIQUE(email));

-- insert into the tables

INSERT INTO about (name, descript) VALUES('Mateo Estrada', 'Hello world');
INSERT INTO admins (name, email, password, aboutid) VALUES('test', 'test', 'test', 8);
