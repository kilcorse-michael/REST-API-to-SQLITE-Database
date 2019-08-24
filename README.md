
# Full Stack JavaScript Techdegree v2 - REST API Project

This is completed for the FSJSTD Unit 9 REST API Project. I am going for exceeds expectations

Run ```npm install``` to download the dependencies and then ```npm start``` to start the server

Server is set to URL: [http://localhost:5000/](http://localhost:5000/).

API routes:
```
  http://localhost:5000/users
    GET: returns the current logged in and authorized user
    POST: creates a new user account
      --fields:
        -firstName: (required)
        -lastName: (required)
        -emailAddress: (required)
        -password: (required)
```
```
  http://localhost:5000/courses
    GET: returns a list of all courses and the associated users that created them
    POST: allows a logged in and authorized user to create a new course
      --field:
        -title: (required)
        -description: (required)
        -materialsNeeded: (optional)
        -estimatedTime: (optional)
```
```
  http://localhost:5000/courses/:id
    GET: returns a specific course and associated creator from the database with the corresponding id
    PUT: allows the logged in and authorized creator of the course to update information in the database
    DELETE: allows the logged in and authorized creator of the course to delete the course from the database  [CAN NOT UNDO!]
```
