
# Todo
- add a mysql table for videos 
- create the users table
- login to admin

- react-table
- form design


- 
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
tskill 5196   // change tskill for !!!!  taskkill in git bash !!!!




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


# Login
https://jodiss-tri.medium.com/build-a-login-system-in-node-js-using-passport-js-and-mysql-52667cf3cc40

# mysql workbench fiyes
0. Go to taskmanager -services tab -> look for 'MySQL3d'..or so and stop process
1. Start with start menu-> "mysql installer" -> select the mysql installer - Community 
2. Click on reconfiguring options
3. In mysql workbench check server availability
4. In Database menu -> reverse engineer

if still not working, then already existing port should be closed: 
1. yarn run server
2. get error info
3. netstat -ano | findstr :5000 
4. ahol fut: tskill 22064   // change tskill for !!!!  taskkill in git bash !!!!

# mysql workbench if no db exists
1. connect to db
2. On left 'Navigator menu', switch from 'Administration' tab to 'Schemas' tab.  
   (Right next to Administration text, it is a tab menu, hard to recognize...it down below from Management, Instance, Performance texts..)
   3. Right-click in the empty space in the right-hand panel and select "Create Schema". 

Other solutions: 
1. Refresh mysql 
https://dev.mysql.com/downloads/file/?id=516926
On refresh page, press try again, and download the file a couple times... 

# send sms
https://developer.vonage.com/en/blog/send-and-receive-sms-messages-with-node-js-and-express