created a simple application
used nodejs,expressjs,mongodb(mongoose)

Installation :- 
npm i (root directory)

to start the project :-
    npm run dev 
    or
    nodemon index.js
    or
    node index.js


make sure to add a .env file in root directory
i have already added a .env.example for that
(here is mongodb link in needed you can use this 
MONGODB_URI = mongodb+srv://user:user@cluster0.szbziif.mongodb.net/ecom2_db?retryWrites=true&w=majority&appName=Cluster0
)



folder Structure :- 
Used MVC structure 

=> index.js is main file.

1) model folder contains models(user model)
2) Controller -> routes related logic
3) routes folder -> contains all necessary routes 
4) middleware contains a error middleware for better error handling and a authentication middleware
5) lib contains database connection logic and custom error handler class also a catchAsyncError function file.


Routes :- 

1) Sign-up :- http://localhost:5000/api/v1/auth/signup

payload data :- {
    "name":"name",
    "email":"example@gmail.com",
    "password":"@dminVRV"
}

(You have to pass proper format of gmail used validation for that
and password must include a special symbol a small letter and a capital letter
)

2) Login route :- http://localhost:5000/api/v1/auth/login
{
    "email":"admin@gmail.com",
    "password":"@dminVRV"
}

(you can use these credentials to login as admin if you using my give mongodb uri)

3) Logout :- http://localhost:5000/api/v1/auth/logout


4) Get all users :- 
(this route can only be accessed by admin)
route :- http://localhost:5000/api/v1/auth/getAllUsers

5) Delete user by admin :-(this route can only be accessed by admin)
route :- http://localhost:5000/api/v1/auth/deleteUserByAdmin/id

just enter id at end of this api to delete that particular user only admin can do that.

6) Assign Roles :- Admin can access different roles to each user according to requirements.(only admin can do that)
route :- http://localhost:5000/api/v1/auth/assignRole

{
    "userId":"66f2999fe2455b2c275e5a96",
    "role":"manager"
}

7) Admin-Manager route :- only admin and manager can access this route
route :- http://localhost:5000/api/v1/auth/admin-manager


-> I have used jwt for authentication and storing that token in cookies
using two tokens refresh token and access token for more security
accessToken will get expire in 15m and access token in 7days.


