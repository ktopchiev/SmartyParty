# Smarty Party

### This is a full-stack AI Powered web application.
### It is a real-time multiplayer quiz game built with ASP.NET, React, Redux Toolkit, SignalR, and PostgreSQL. 
### Players can join quiz rooms, chat, and compete in live trivia rounds.

**Note:**
It is still not live.

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
2. Go to the project, cd to /API and run `dotnet watch --no-hot-reload`.
3. Cd to SmartyParty/client and run `npm run dev`. Now you can explore the running app on [http://localhost:3000](http://localhost:3000).
4. To test the API endpoints go to:
   - [http://localhost:5000/swagger ](http://localhost:5000/swagger/index.html)
