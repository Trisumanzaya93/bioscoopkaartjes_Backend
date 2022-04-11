# BE-TICKETING-Project

# Tickitz

This project is named TICKITZ.
TICKITZ is an online cinema ticket booking platform.

Repo ini berisikan project backend pertama saya yang di beri judul Tickitz.
Repo ini berisikan folder Tickitz.
Mencakup folder src, file .eslintrc.js, package-lock.json, package.json.
src mencakup: index.js, config, helpers, modules/movie, routes.

## INIT

[![express](https://img.shields.io/npm/v/express?label=express)](https://www.npmjs.com/package/express)
[![mysql](https://img.shields.io/npm/v/mysql?label=mysql)](https://www.npmjs.com/package/mysql)
[![jsonwebtoken](https://img.shields.io/npm/v/jsonwebtoken?label=jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
[![bcrypt](https://img.shields.io/npm/v/bcrypt?label=bcrypt)](https://www.npmjs.com/package/bcrypt)
[![cors](https://img.shields.io/npm/v/cors?label=cors)](https://www.npmjs.com/package/cors)
[![multer](https://img.shields.io/npm/v/multer?label=multer)](https://www.npmjs.com/package/multer)

## Installation

- `npm i express body-parser cors morgan mysql2 helmet xss-clean compression`
- `npm i nodemon -D`
- `npx eslint --init`
- `npm i eslint prettier eslint-config-prettier eslint-plugin-prettier -D`

## Additional Instalation

- `npm install --save multer`
- `npm install nodemailer`
- `npm install cloudinary`
- `npm install --save midtrans-client`

## HOW TO RUN THE APP?

1. Open app's directory in CMD or Terminal

2. Type

```
$ npm instal
```

3. Make new file a called .env, set up first here
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name #database_name, and Import file sql to phpmyadmin
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)

## Modularisation

- Public = a place to store uploaded files / files that can later be accessed publicly by users
- Src = a place to store code from the created backend project
  - index.js = root file to configure some libraries/frameworks for later use in the project
  - Config = configuration saver
  - Helpers = a place to store a function that can be used in a different file
  - Routes = a place to accommodate all the route paths that are in the module / as navigation routes
  - Modules = a place to group a feature in a request
    - Routes = a place to store the path of each request / method
    - Controller = logic / a place to store request data / issue a response
    - Model = a place to set database queries
