# Web 3D database and experiments
## MySQL, Express, React, Node (MERN) stack application with 3D models
## Overview

This project was created as part of my DLA  research, and it was prepared for my doctoral defense presentation with the purpose of testing web 3D models. You'll find a collection of experiments with 3D WebGL and WebGPU libraries such as Three.js and Babylon.js. 

This project is a full-stack application that utilizes the MERN stack, with Node.js and Express.js for the backend, React.js for the frontend, and MySQL for the database. By uploading 3D models, they are stored in a designated folder specified in the configuration and are saved in the database. CRUD operations can be performed on the models, including creating, reading, updating, and deleting them, as well as adding or deleting models to/from folders. 

The 3D models included in the project were created using Blender and are saved as gltf and glb files, which can be viewed directly in the browser. As a work in progress, the project will continue to add more models and experiments in the future. Feedback is welcome, and you are free to contact me with any suggestions on how to improve the project.

## Installation
1. To install dependencies, run:
`yarn install`

2. Set up MySQL database

## Usage
To use this project, run:

`yarn run 3D`

or: 

`yarn server`
`yarn client`


## Contributing
### Contributions are welcome! 
If you want to contribute to this project, please follow these steps:
To contribute code changes, please follow these steps:

1. [Fork the repository](https://help.github.com/en/articles/fork-a-repo) to your own account.
2. Create a new branch for your changes: `git checkout -b your-branch-name`
3. Make your changes and commit them: `git commit -am 'Add some feature'`
4. Push your branch to your fork: `git push origin your-branch-name`
5. [Submit a pull request](https://help.github.com/en/articles/creating-a-pull-request) with a clear and descriptive title, as well as a detailed description of the changes you made.



## License
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License https://creativecommons.org/licenses/by-nc/4.0/.

This means that you are free to use and modify the code for non-commercial purposes, as long as you give attribution to the original author and license any derivative works under the same license. If you want to use the code for commercial purposes, please contact me.

## Contact
Feel free to contact me through [my LinkedIn profile](https://www.linkedin.com/in/balogh-aron/)!

Created by [Aron Balogh](https://github.com/balogharon).

Last updated on 2023-04-09.


### Doc help
https://github.com/balogharon/3d/tree/8446a4c52ffa7b7f9cc9a841ff5720fb2091cd3c#readme


## settings

git config --global http.proxy http://192.168.92.40:8080
git config --global https.proxy http://192.168.92.40:8080
git config --global http.sslVerify false

npm config set https-proxy http://192.168.92.40:8080
npm config set http-proxy http://192.168.92.40:8080
npm config set strict-ssl false

npm install -g yarn
yarn cache clean
yarn config set strict-ssl false


# get certs
wind -> certmgr.msc

 

/*

Materialok --> cinema3D-nél tex */
/**

node-sp-auth-config
Profil
Login
Kedvencek
Feltöltéseim
Ai file */
Hasznos linkek:
Mosh Hamedani a legjobb: https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/

itttt::: https://mfikri.com/en/blog/node-express-react-mysql

jó: https://www.bezkoder.com/react-node-express-mysql/ https://www.becomebetterprogrammer.com/mysql-nodejs-expressjs-typescript/

https://blog.logrocket.com/build-rest-api-node-express-mysql/ https://www.designmycodes.com/examples/node-js-express-sequelize-mysql.html

https://www.tutsmake.com/how-to-send-data-from-react-to-node-js-express-mysql/ https://codingpr.com/react-typescript-and-express/ https://www.tutsmake.com/react-js-node-js-file-upload-tutorial-with-example/

https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/ https://create-react-app.dev/docs/developing-components-in-isolation

https://www.becomebetterprogrammer.com/mysql-nodejs-expressjs-typescript/ https://arctype.com/blog/rest-api-tutorial/ https://blog.logrocket.com/build-rest-api-node-express-mysql/

Basic yarn codes
yarn start yarn build yarn test

Install and update yarn
npm install --global yarn

Upgrade
yarn upgrade --latest react-scripts

Install CRA
yarn create react-app . --template typescript

Add ts to existing project
yarn add typescript @types/node @types/react @types/react-dom @types/jest

Add sass
yarn add sass

Lib ideas
https://github.com/w3tecch/express-typescript-boilerplate

Multi remotes
git remote set-url --add --push origin https://git-scm.mtva.hu:8080/git/3dfejlesztes git remote set-url --add --push origin https://github.com/balogharon/3d.git

yarn run start

doc
https://create-react-app.dev/docs/integrating-with-an-api-backend https://www.newline.co/fullstack-react/articles/using-create-react-app-with-a-server/

original react script starter in package.json
"start": "react-scripts start",

port terminal
yarn add kill-port -- telepítése

use it like: netstat -ano | findstr :3000 netstat -ano | findstr :5000 // vagy PORT3D in config

ahol fut: tskill 5196 // change tskill for taskkill in git bash

mysql workbanch
INSERT INTO mysql.user (Host, User, Password) VALUES ('%', 'root', password('YOURPASSWORD')); GRANT ALL ON . TO 'root'@'%' WITH GRANT OPTION;

Execute the following query in MYSQL Workbench

ALTER USER 'root'@'localhost' IDENTIFIED BY 'Asdqwe123';

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Asdqwe123'; flush privileges;

Start - stop service in Task Manager
install if error
yarn add nodemon yarn add ts-node

sequalize data types
https://sequelize.org/docs/v7/other-topics/other-data-types/

Express hints
https://medium.com/@adamzerner/middleware-in-express-60d75055ba8f

React ecosystem
https://docs.pmnd.rs/react-three-fiber/getting-started/introduction


# inst

git config --global http.proxy http://192.168.92.40:8080
git config --global https.proxy http://192.168.92.40:8080
git config --global http.sslVerify false

npm config set proxy http://192.168.92.40:8080
npm config set https-proxy http://192.168.92.40:8080
npm config set strict-ssl false

npm install -g yarn
yarn cache clean
yarn config set strict-ssl false
