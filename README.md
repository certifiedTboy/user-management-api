<div align="center" id="top"> 
 
  &#xa0;

  <!-- <a href="https://usermanagementapi.netlify.app">Demo</a> ---->
</div>

<h1 align="center">User Management Api</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/certifiedTboy/user-management-api?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/certifiedTboy/user-management-api?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/certifiedTboy/user-management-api?color=56BEB8">

</p>

- [Introduction](#Introduction)
- [Technologies](#Technologies)
- [Enviromental Variables](#Enviromental-Variables)
- [Get Started](#Get-Started)
- [CRUD Operations](#Crud-Operations)
- [Account Creation Flow](#Account-Creation-Flow)
- [Authentication Flow](#Authentication-Handling)
- [API Documentation](#API-Documentation)
- [User Flow Design](#Userflow-Design)

<br>

## Introduction

This is a simple user management API that handles basic user creation of account and user authentication

## Technologies

The following technologies were used:

- [Node Js](#Node)
- [JWT for handling user authentication and authorization](#JWT)
- [Nodemailer and Elastic Mail for handling email service](#)
- [Mongo Db for Data Persistency](#)

## Enviromental Variables 
Refer to config/config file for all enviromental variables

## Get-Started

```bash
# Clone this project
$ git clone https://github.com/certifiedTboy/user-management-api

# Access
$ cd user-management-api

# Install dependencies
$ npm install

# Run the project 
$ npm start (Production server)
$ npm run dev (Development server)

# The server will initialize in the <http://localhost:3001>
```

## CRUD Operations
- User can create account
- Verify account on creation success
- Login and Logout after successful verification
- Update personal details
- Delete Accounts
- For the sake of testing privileges, on Admin user type can delete other users Account



## Account Creation Flow
- To create an account, users need to provide FirstName, LastName and a unique email address 
- If email is unique and request was successful, a response of success message is sent and a mail containing verification URL is sent to the unique email address if valid and existing.
- For the sake of testing, account creation success response may contain user unique Id and a verification token to enable easy verification on POSTMAN agent
- On verification success, A response of success message is sent with user unique email address which can be used to update user password for further authentication (Login)
- Passwords are valid only if it contains a minimum of one Uppercase and Lowercase text, a Symbol and a Number and must not be shorter than eight(8) characters


## Authentication Flow
- Authentication and Authorization is handled with Jsonwebtoken (JWT) and it follows the OAUTH flow standard
- On successful login, an access token and a refresh token is generated, refresh token is sent as an HTTP only flagged cookie to client with a validity period of 24 hours. The access token is sent as a response data to be used for subsequent requests. The access token has a validity period of 30 Minutes. Tokens are signed with the user unique Id and user-type (ADMIN / USER) 
- All subsequent request that requires authorization must be made with the access token as authorization request header with a Bearer flag.
- On access token expiration, a request is made to a /refresh-token endpoint with refresh token as req.cookies header. 
- If refresh token is valid and contains verifiable data, a new access token is sent back to client for subsequent request. 
- on refresh token expiration, client is required to login again to generate new refresh token and access token 
- For testing on POSTMAN agent, refer to [postman interceptor](https://learning.postman.com/docs/sending-requests/cookies/#:~:text=Postman%20can%20capture%20cookies%20for,with%20the%20Postman%20cookie%20jar.) to handle cookie
- On frontend libraries like React, authorization with cookies are easily handled with [Redux RTK Queries](https://redux-toolkit.js.org/tutorials/rtk-query)

## API Documentation
All API http request endpoints are available on [https://documenter.getpostman.com/view/14393972/2s9XxsWcWm](https://documenter.getpostman.com/view/14393972/2s9XxsWcWm) 

Use [https://user-management-api-y41j.onrender.com/api/v1](https://user-management-api-y41j.onrender.com) for live testing

## User Flow Design

A simple IA Userflow Design is available on [https://whimsical.com/user-management-app-J2p1ryoGVwKXLR23WBJpaS](https://whimsical.com/user-management-app-J2p1ryoGVwKXLR23WBJpaS) 

<a href="#top">Back to top</a>
