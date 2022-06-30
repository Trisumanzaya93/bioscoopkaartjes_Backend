<div id="top"></div>

<div align="center">
<h1 align="center"><b>bioscoopkaartjes_backend</b></h1>

<br/>
<img src="./asset/logobiosscoopkaartjes.png" alt="Logo" width="450">
<p align="center">Cinema ticketing API : provide request that can help you ordering cinema tickets from home</p>

<br/>

[![express](https://img.shields.io/npm/v/express?label=express)](https://www.npmjs.com/package/express)
[![jsonwebtoken](https://img.shields.io/npm/v/jsonwebtoken?label=jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
[![bcrypt](https://img.shields.io/npm/v/bcrypt?label=bcrypt)](https://www.npmjs.com/package/bcrypt)
[![cors](https://img.shields.io/npm/v/cors?label=cors)](https://www.npmjs.com/package/cors)
[![cloudinary](https://img.shields.io/npm/v/cloudinary?label=cloudinary)](https://cloudinary.com/)
[![googleapis](https://img.shields.io/npm/v/googleapis?label=googleapis)](https://www.npmjs.com/package/googleapis)
[![mysql2](https://img.shields.io/npm/v/mysql2?label=mysql2)](https://www.npmjs.com/package/mysql2)
[![nodemailer](https://img.shields.io/npm/v/nodemailer?label=nodemailer)](https://nodemailer.com/about/)
[![redis](https://img.shields.io/npm/v/redis?label=redis)](https://redis.io/)

<br/>

[**Instalation**](#instalation) | [**Publication**](#publication) | [**How It Works**](#how-it-works) | [**What To Do**](#what-to-do) | [**Endpoint**](#endpoint) | [**Acknowledgements**](#acknowledgements)

<br/>
</div>

<hr/>

<div>

## **Instalation**

</div>

1. Clone this repository

   ```bash
   $ git clone https://github.com/erikasempana/bioscoopkaartjes_Backend.git
   ```

2. Open Project Folder

   ```
   $ cd project-name
   ```

3. Instal Depedencies

   ```
   $ npm install
   ```

4. Run the Project
   ```
   $ npm start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>
<hr/>

## **Publication**

<br/>

- Link Heroku : https://bioscoopkaartjes.herokuapp.com/

- Link Cloudinary : https://res.cloudinary.com/erikasempana/image/upload/v1655692721/

- Posman Collection: https://documenter.getpostman.com/view/20137808/UzBjuU8H

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>
<hr/>

## **How It Works ?**

 <br/>
 
1. Download bioscoopkaartjes's Postman Collection [[here](https://drive.google.com/file/d/1dBuM-7mrc9IANC0IJOusumiQqnBPvT-V/view?usp=sharing)]
2. Import the bioscoopkaartjes's Postman Collection on your local Postman
3. Create Environtments in Postman & Set :

    ```bash
    VARIABLE : bioscoopkaartjes
    INITIAL VALUE : https://bioscoopkaartjes.herokuapp.com
    CURRENT VALUE : https://bioscoopkaartjes.herokuapp.com
    ```

4. Well done! Now, you can test the request

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>
<hr/>

## **What To Do ?**

<br/>

1. Register using your real information
2. Open your registered email address
3. Open email and follow the instruction to verify your account
4. Login and use the API

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>
<hr/>

## **EndPoint**

<br/>

### <span style='font-size:15px;'>&#10032;</span> Module Auth

**Used for authentication**

| No. | Method | Endpoint               | Information                      |
| --- | ------ | ---------------------- | -------------------------------- |
| 1.  | POST   | /auth/register         | Used for register new user.      |
| 2.  |        | /auth/login            | Used for login into app.         |
| 3.  |        | /auth/logout           | Used for logout from system.     |
| 4.  |        | /auth/refresh          | Used for new refresh token.      |
| 5.  | PATCH  | /auth/updateStatus/:id | Used for activate status account |

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>

### <span style='font-size:15px;'>&#10032;</span> Module User

**Used for any user feature**

| No. | Method | Endpoint              | Information                   |
| --- | ------ | --------------------- | ----------------------------- |
| 1.  | GET    | /user/:userId         | Used for get user by id       |
| 2.  | PATCH  | /user/profile/:userId | Used to edit profile user.    |
| 3.  |        | /user/image/:userId   | Used to change image user.    |
| 4.  |        | /user/password        | Used to change password user. |

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>

### <span style='font-size:15px;'>&#10032;</span> Module Movie

**Used for movie data**

| No. | Method | Endpoint                                                                          | Information                            |
| --- | ------ | --------------------------------------------------------------------------------- | -------------------------------------- |
| 1.  | POST   | /movie                                                                            | Used for create movie (role: Admin).   |
| 2.  | GET    | /movie/?limit=4&page=1&sort=DESC&sortBy=name&searchRelease=5&searchName=spiderman | Used for get all data movie            |
| 2.  |        | /movie/:idMovie                                                                   | Used for get data movie by id movie    |
| 2.  | PATCH  | /movie/idMovie                                                                    | Used for update detail data movie      |
| 3.  | DEL    | /movie/:idMovie                                                                   | Used to delete data movie by id movie. |

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>

### <span style='font-size:15px;'>&#10032;</span> Module Schedule

**Used for schedule data**

| No. | Method | Endpoint                                                                           | Information                                       |
| --- | ------ | ---------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1.  | POST   | /schedule/                                                                         | Used for create schedule movie                    |
| 2.  | GET    | /schedule?limit=6&page=1&searchMovieId=35&searchLocation=Bogor&sort=DESC&sortBy=id | Used for get all data schedule using the filter . |
| 2.  | GET    | /schedule/movie/:movieId                                                           | Used for get all data schedule by id movie.       |
| 2.  | GET    | /schedule/:idSchedule                                                              | Used for get data schedule by id schedule.        |
| 3.  | PATCH  | /schedule/:idSchedule                                                              | Used to edit detail data schedule .               |
| 4.  | DEL    | /schedule/:idSchedule                                                              | Used to delete data schedule.                     |

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>

### <span style='font-size:15px;'>&#10032;</span> Module Booking

**Used for booking data**

| No. | Method | Endpoint                                                                      | Information                                                 |
| --- | ------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1.  | POST   | /booking                                                                      | Used for create booking.                                    |
| 1.  | POST   | /booking/midtrans-notification                                                | Used for notification payment.                              |
| 2.  | GET    | /booking/user/:userId                                                         | Used for get data booking by id user.                       |
| 2.  | GET    | /booking/:id                                                                  | Used for get data booking by id booking.                    |
| 2.  | GET    | /booking/seatbooking?scheduleId=4&dateBooking=2022-01-01&timeBooking=09:00:00 | Used for get data seat booking.                             |
| 2.  | GET    | /booking/dashboard?scheduleId=1&movieId=1                                     | Used for get data total payment by schedule id or movie id. |
| 3.  | PATCH  | /booking/ticket/:id                                                           | Used to update status use ticket                            |
| 4.  | DEL    | /portofolio/:id                                                               | Used to delete portofolio employee.                         |

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>
<hr/>

## **Acknowledgements**

- [Express](https://www.npmjs.com/package/express)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cors](https://www.npmjs.com/package/cors)
- [cloudinary](https://cloudinary.com/)
- [googleapis](https://www.npmjs.com/package/googleapis)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [nodemailer](https://nodemailer.com/about/)
- [redis](https://redis.io/)

<p align="right">(<a href="#top">back to top</a>)</p>
<br/>
<hr/>
