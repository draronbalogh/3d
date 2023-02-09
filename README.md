
# Todo
- form validation for text max length for 1000 chars
- differnet db tables for images and videos and 3d models
- react-table
- login to admin
- form design

/*
 * Materialok --> cinema3D-nél tex
 */

/**
 * node-sp-auth-config
 * Profil
 * Login
 * Kedvencek
 * Feltöltéseim
 * Ai file
 */


# Hasznos linkek:
Mosh Hamedani a legjobb:
https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/


itttt:::
https://mfikri.com/en/blog/node-express-react-mysql

jó:
https://www.bezkoder.com/react-node-express-mysql/
https://www.becomebetterprogrammer.com/mysql-nodejs-expressjs-typescript/

https://blog.logrocket.com/build-rest-api-node-express-mysql/
https://www.designmycodes.com/examples/node-js-express-sequelize-mysql.html


https://www.tutsmake.com/how-to-send-data-from-react-to-node-js-express-mysql/
https://codingpr.com/react-typescript-and-express/
https://www.tutsmake.com/react-js-node-js-file-upload-tutorial-with-example/


https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/
https://create-react-app.dev/docs/developing-components-in-isolation

https://www.becomebetterprogrammer.com/mysql-nodejs-expressjs-typescript/
https://arctype.com/blog/rest-api-tutorial/
https://blog.logrocket.com/build-rest-api-node-express-mysql/
 
# Basic yarn codes
yarn start
yarn build
yarn test

# Install and update yarn
npm install --global yarn
## Upgrade
yarn upgrade --latest react-scripts
# Install CRA
yarn create react-app . --template typescript
## Add ts to existing project
yarn add typescript @types/node @types/react @types/react-dom @types/jest

# Add sass
yarn add sass

# Lib ideas
https://github.com/w3tecch/express-typescript-boilerplate

# Multi remotes
git remote set-url --add --push origin https://git-scm.mtva.hu:8080/git/3dfejlesztes
git remote set-url --add --push origin https://github.com/balogharon/3d.git


yarn run start


# doc
https://create-react-app.dev/docs/integrating-with-an-api-backend
https://www.newline.co/fullstack-react/articles/using-create-react-app-with-a-server/
 

 # original react script starter in package.json
"start": "react-scripts start",


# port terminal
yarn add kill-port -- telepítése

use it like:
netstat -ano | findstr :3000
netstat -ano | findstr :5000 // vagy PORT3D in config

ahol fut:
tskill typeyourPIDhere   // change tskill for taskkill in git bash




# mysql workbanch


0.
INSERT INTO mysql.user (Host, User, Password) VALUES ('%', 'root', password('YOURPASSWORD'));
GRANT ALL ON *.* TO 'root'@'%' WITH GRANT OPTION;

1. 
Execute the following query in MYSQL Workbench

ALTER USER 'root'@'localhost' IDENTIFIED BY 'Asdqwe123'; 


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Asdqwe123';
flush privileges;

1. Start - stop service in Task Manager


# install if error
yarn add nodemon
yarn add ts-node


# sequalize data types
https://sequelize.org/docs/v7/other-topics/other-data-types/



# Express hints
https://medium.com/@adamzerner/middleware-in-express-60d75055ba8f

# React ecosystem
https://docs.pmnd.rs/react-three-fiber/getting-started/introduction
