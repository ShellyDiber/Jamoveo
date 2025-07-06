# Jamoveo 

Git repository link: https://github.com/ShellyDiber/Jamoveo.git

## Tech Stack

- **Frontend**: React + TypeScript  
- **Backend**: NestJS + TypeScript  
- **Database**: PostgreSQL  
- **Deployment**: AWS EC2 with Nginx reverse proxy

## URL:
**URL:** https://jamoveo.diber.net/

- To sign up as a **regular user**, go to the website and click the Sign Up link.

- To signup as **admin user** , go to https://jamoveo.diber.net/adminSignup . 


## API Endpoints Overview

All endpoints are available under the base URL:  
`https://jamoveo.diber.net/api`

When working locally, use:  
`http://localhost:3000/api`


###  Auth Endpoints (`/auth`)

- `POST /auth/login`  
  Log in with username and password. Returns a JWT token and user info.


### User Endpoints (`/users`)

- `POST /users`  
  Sign up with a new user (regular or admin) by sending username and password.



### Song Endpoints (`/songs`)

- `GET /songs`  
  Retrieve all songs, or search using `?q=` query param 

- `GET /songs/:id`  
  Get a specific song by its ID.

- `POST /songs`  
  Add a new song .

- `GET /songs/play/:id`  
  Notify all connected clients about the new song and start playing the song.

- `GET /songs/current`  
  Get the currently playing song.



## How to Run the Project Locally:

### Clone the repository

```bash
git clone https://github.com/ShellyDiber/Jamoveo.git
cd Jamoveo 

# Run the Frontend
cd frontend
yarn
yarn start

#Run the Backend
cd ../backend
yarn
yarn start

The frontend will run locally at: http://localhost:5173
The backend will run locally at: http://localhost:3000



