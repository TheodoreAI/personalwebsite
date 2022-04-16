# Personal Website
# Nov 2, 2021

This runs in cloud platform Heroku at: http//:mateoestrada.org

#### To run update checks to make sure that the safest and latest version is used (Credit: https://stackoverflow.com/questions/16073603/how-to-update-each-dependency-in-package-json-to-the-latest-version):

- npm i -g npm-check-updates
- ncu -u
- npm install



## 1.

- Updates:
    + adding a user authentication interface 
        - DONE
    + adding an S3 connection to store files and access them.
    + dynamically update the front-end interface via the admin dashboard. 
        - I can dynamically add things to my profile section

## 2. Adding the database

    Connect Database: https://www.postgresqltutorial.com/postgresql-show-tables/
    - psql -U postgres -W
    - \c devfoliodb

    Restart the database:
    - psql -h localhost -d devfoliodb -U mateoestrada -f filename.sql

## 3. TO DO:
    - Need to fix bug with title in the database server.js
    - WORKING ON THE IP ADDRESS AND LOCATION data section
    - REMEMBER TO UNCOMMENT IN THE dbconfig.js before deploying to production