[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/-Z3-Ss4P)
# Project Milestone 3 Overview

For this week's assignment, we are tasked to create a fullstack app with the theme: "To-do App"

The capabilities of the project are:
1. CRUD Implementation 
- Create
- Read
- Update
- Delete (isDeleted / soft delete)
2. Database 
- MySQL (& Localhost)
3. Authentication and Authorization
- Authentication: JWT (& Bcrypt) & Cookies
- Authorization: Role-Based Access Control (RBAC)

##  Project Features:
- **Theme**: To-do App
- **BCrypt** for Password Hashing
- **JWT** for Authentication and Authorization
- **Node-cache** for caching tokens (access token & refresh token)
- **Cookie-parser** for storing tokens (access token & refresh token)
- **Typescript** as the programming language
- **MySQL** for the database service
- **Railway** as the online database service

## API Endpoints

<p align="center">
<a href="https://w18sh-ry.up.railway.app/">w18sh-ry.up.railway.app</a>
</p> 

## Sample Accounts
```JSON
Client:
    "email": "dreya@gmail.com",
    "password":"dreya123"
```
```JSON
Staff:
    "email":"zoya@gmail.com",
    "password":"Zoyaa321"
```
```JSON
Admin:
    "email":"adminr00@gmail.com",
    "password":"R00isADMIN"
```
<br>


## Request Required Data:
**USERS:**
```JSON
Register (default role: client):
{
    "username":"yourUsername",
    "email": "your@email.com",
    "password":"yourP4ssw0rd"
}
```
```JSON
Register by Admin (can give roles: client, staff, admin):
{
    "username":"yourUsername",
    "email": "your@email.com",
    "password":"yourP4ssw0rd",
    "role": "role"
}
```
```JSON
Login:
{
    "email": "your@email.com",
    "password":"yourP4ssw0rd"
}
```
```JSON
Password Reset Request:
{
    "email": "your@email.com"
}
```
```JSON
Password Reset:
{
    "password":"yourN3WP4ssw0rd"
}
```
```JSON
Update (parameter: userId):
{
    "name":"yourName",
    "city":"yourAddress(city/country)",
    "about_me": ""
}
```
<br>


**TASKS:**
```JSON
Create New Task:
{
    "title": "Task Title",
    "description": "Task Description",
    "purpose": "Task Purpose (work/personal/finance/misc)",
    "due_date": "yyyy-mm-dd format"
}
```
```JSON
Edit Task:
{
    "title": "New? Task Title",
    "description": "New? Task Description",
    "purpose": "Task Purpose (work/personal/finance/misc)",
    "due_date": "yyyy-mm-dd format"
}
```
```JSON
Update Task Completion:
{
    "completed": 1
    // boolean: 0 for false, 1 for true
}
```
<br>

## API Endpoints
<p align="center">
<a href="https://w18sh-ry.up.railway.app/">w18sh-ry.up.railway.app</a>
</p> 

**USERS**
<div align="center">

| Name  | HTTP Method | Endpoint | Authentication | Authorization |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **Homepage** | `GET` |[/](https://w18sh-ry.up.railway.app/) | ❌ | ❌ |
| **Register User** | `POST` | [/api/users/register](https://w18sh-ry.up.railway.app/api/users/register) | ❌ | ❌ |
| **Register User By Admin** | `POST` | [/api/users/admin/register](https://w18sh-ry.up.railway.app/api/users/admin/register) | ✔ | **admin** |
| **Login User** | `POST` | [/api/users/login](https://w18sh-ry.up.railway.app/api/users/login) | ❌ | ❌ |
| **Logout User** | `POST` | [/api/users/logout](https://w18sh-ry.up.railway.app/api/users/logout) | ✔ | ❌ |
| **Request Password Reset** | `POST` | [/api/users/resetpassword/request](https://w18sh-ry.up.railway.app/api/users/resetpassword/request) | ✔ | ❌ |
| **Password Reset** | `POST` | [/api/users/resetpassword](https://w18sh-ry.up.railway.app/api/users/resetpassword) | ✔ | ❌ |
| **Request Refresh Token** | `POST` | [/api/users/refresh](https://w18sh-ry.up.railway.app/api/users/refresh) | ✔ | ❌ |
| **Update Name, City, & About Me** | `PATCH` | [/api/users/update/{id}](https://w18sh-ry.up.railway.app/api/users/update/3) | ✔ | **client**, **staff**, **admin** |
| **List All Client Data** | `GET` | [/api/users/clients](https://w18sh-ry.up.railway.app/api/users/clients) | ✔ | **staff**, **admin** |
| **List All Staff Data** | `GET` | [/api/users/staff](https://w18sh-ry.up.railway.app/api/users/staff) | ✔ | **admin** |
| **Get Specific User Data ('client' can only see their own)** | `GET` | [/api/users/profile/{id}](https://w18sh-ry.up.railway.app/api/users/profile/1) | ✔ | **client**, **staff**, **admin** |
| **User Profile (each user sees their own)** | `GET` | [/api/users/profile](https://w18sh-ry.up.railway.app/api/users/profile) | ✔ | **client**, **staff**, **admin** |
</div>

**TASKS**
<div align="center">

| Name  | HTTP Method | Endpoint | Authentication | Authorization |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **Homepage** | `GET` |[/](https://w18sh-ry.up.railway.app/) | ❌ | ❌ |
| **Create New Taks** | `POST` | [/api/tasks/new](https://w18sh-ry.up.railway.app/api/tasks/new) | ✔ | **client**, **staff**, **admin** |
| **List All Tasks ('client' can only see their own)** | `GET` | [/api/tasks](https://w18sh-ry.up.railway.app/api/tasks) | ✔ | **client**, **staff**, **admin** |
| **Edit Task** | `PUT` | [/api/tasks/edit/{taskId}](https://w18sh-ry.up.railway.app/api/tasks/edit/2) | ✔ | **client**, **staff**, **admin** |
| **Update Task Completion** | `PATCH` | [/api/tasks/update/{taskId}](https://w18sh-ry.up.railway.app/api/tasks/update/2) | ✔ | **client**, **staff**, **admin** |
| **Delete Task (Soft Delete)** | `DELETE` | [/tasks/delete/{taskId}](https://w18sh-ry.up.railway.app/api/tasks/delete/1) | ✔ | **client**, **staff**, **admin** |

</div>

## How to Run the App
u
For testing purposes, please use `Postman` / `Thunder Client` VSCode extension.
(postman collection available in root directory of the project)
Otherwise:
- git clone or download this repository to your machine
- install the necessities: `pnpm i` / `npm i`
- use the `.env.example` to create your own `.env` file (please contact me for my `.env` details)
- `Admin` (aka `Super User`) is automatically generated through a function placed in `src/config/superAdminConfig`, please contact me if you want me to delete the `admin` data manually from database for any testing needs!


### Contact Me:

<img src="https://raw.githubusercontent.com/RevoU-FSSE-2/week-7-SherinOlivia/3dd7cdf0d5c9fc1828f0dfcac8ef2e9c057902be/assets/gmail-icon.svg" width="15px" background-color="none">[SOChronicle@gmail.com](mailto:SOChronicle@gmail.com) [Personal]

<img src="https://raw.githubusercontent.com/RevoU-FSSE-2/week-7-SherinOlivia/3dd7cdf0d5c9fc1828f0dfcac8ef2e9c057902be/assets/gmail-icon.svg" width="15px" background-color="none">[SOlivia198@gmail.com](mailto:SOlivia198@gmail.com) [Work]

[![Roo-Discord](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-discord.svg)](https://discord.com/users/shxdxr#7539)[![Roo-Instagram](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-instagram.svg)](https://instagram.com/shxdxr?igshid=MzRlODBiNWFlZA==)[![Roo-LinkedIn](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-linkedin-circled.svg)](https://www.linkedin.com/in/sherin-olivia-07311127a/)