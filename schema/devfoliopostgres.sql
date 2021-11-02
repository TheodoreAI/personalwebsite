-- Building the database with this file:
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS about;

-- Table for the about section of my webpage

CREATE TABLE about
(id BIGSERIAL PRIMARY KEY NOT NULL,
name VARCHAR(200),
visits INTEGER,
descript VARCHAR(1000));

-- Table for the admin
CREATE TABLE admins
(id BIGSERIAL PRIMARY KEY NOT NULL,
name VARCHAR(200) NOT NULL,
email VARCHAR(200) NOT NULL,
password VARCHAR(200) NOT NULL,
aboutid INTEGER REFERENCES about(id),
UNIQUE(email));

-- insert into the tables

INSERT INTO about (name, visits, descript) VALUES('Mateo Estrada', 0, 'Hello world');
-- INSERT INTO admins (name, email, password, aboutid) VALUES('test', 'test', 'test', 1);

-- Descritpion: at Oregon State University. He has designed, programmed, and build software systems using 
-- various technologies in the multi-disciplinary fields of physics and computer science. 
-- He has designed the main page of NASA's Established Program to Stimulate Competitive Research. 
-- Mateo has worked in marine conservation research with the Hatfield Marine Science Center as well as renewable energy research at Arizona State University. 
-- He is passionate about finding ways to combat climate change using computer science and physics.