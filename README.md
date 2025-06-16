## Smarty Party

### This is a full-stack AI Powered web application.
### It is a real-time multiplayer quiz game built with ASP.NET, React, Redux Toolkit, SignalR, and PostgreSQL. 
### Players can join quiz rooms, chat, and compete in live trivia rounds.
### It is containerized with Docker and deployed on Fly.io.

## 🔑 Key Features

- 🧠 **Real-Time Multiplayer Quizzes**  
  Users can join quiz rooms and answer AI-generated questions in real-time.

- 📡 **SignalR Integration**  
  WebSocket communication for live room updates, player joins/leaves, and chat.

- 💬 **In-Room Chat**  
  Each quiz room supports real-time text chat among participants.

- 🏆 **Score Tracking & Results**  
  Players earn points for correct answers and see live leaderboards.

- 🧍 **Room Management**  
  Users can create and join rooms. Rooms can be locked or open.

- 🌐 **Cyrillic Support**  
  Fully supports questions and answers in Bulgarian (Cyrillic).

- 🧠 **ChatGPT-Generated Questions**  
  Dynamically generates trivia questions using AI.

- 💾 **Redux Toolkit & RTK Query**  
  Manages client-side state and API data efficiently.

- 🔐 **JWT Authentication**
  Secure login/register system with token-based auth.


### Tech Stack:
•	**Backend**: ASP.NET Core, Minimal API, SignalR, OpenAI, Entity Framework Core, PostgreSQL

•	**Frontend**: React, Redux, Bootstrap

•	**Deployment**: Docker, Fly.io, GitHub Actions

### How to run the app locally:

1. Create a project folder, open a terminal and cd to that folder, then run this command `git clone https://github.com/ktopchiev/SmartyParty` to clone the project.
2. [Install](https://www.docker.com/get-started/) Docker for desktop.
4. Go to terminal and run `docker run --name devDb -e POSTGRES_USER=appuser -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:latest`.
5. Now Postgres Db container should be running. *When the initial image is created you can use Docker desktop to run it. Go to Containers and run devDb.*
6. Go to the project, cd to /API and run `dotnet watch --no-hot-reload`.
7. Cd to E-commerce/client and run `npm start`. Now you can explore the running app on [http://localhost:3000](http://localhost:3000).
8. To test the API endpoints go to:
   - [http://localhost:5000/swagger ](http://localhost:5000/swagger/index.html)
