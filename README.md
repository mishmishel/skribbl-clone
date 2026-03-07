# Draw & Guess

A real-time multiplayer drawing and guessing game built from scratch. Players join a private room, take turns drawing a secret word, and race to guess what others are drawing.

**Live Demo:** [skribbl-clone-pi.vercel.app](https://skribbl-clone-pi.vercel.app)
> **Note:** The backend is hosted on Render's free tier and may take 30–60 seconds to wake up on first load. If the app doesn't respond immediately, please wait a moment and refresh!

---

## Features

- **Real-time multiplayer** — drawing strokes sync instantly across all players using WebSockets
- **Private rooms** — create a room and share the code with friends to join
- **Live scoring** — points awarded for correct guesses, leaderboard updates in real time
- **Turn rotation** — every player gets a turn to draw across multiple rounds
- **Early round end** — round ends immediately when all players guess correctly
- **Host controls** — only the room host can start the game
- **Disconnect handling** — players can leave mid-game without breaking the session; host transfers automatically

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Real-time | Socket.io |
| Styling | CSS |
| Deployment | Vercel (frontend), Render (backend) |

### Architecture

The app is split into two independent services:

**Frontend** (`/client`) — A React single-page application that manages UI state and communicates with the server via Socket.io. Uses a phase-based navigation system (`home → lobby → game → scoreboard`) rather than a router, since the app state is tightly coupled to the socket connection.

**Backend** (`/server`) — A stateless Node.js/Express server that owns all game state in memory. Manages room creation, player sessions, turn rotation, scoring, and timer logic. Broadcasts game events to all players in a room via Socket.io namespaced rooms.

**Key technical decisions:**
- Game state lives entirely on the server to prevent cheating (the current word is never sent to non-drawers)
- Canvas drawing is synced by emitting stroke coordinates and type (`start`/`draw`) rather than image data, keeping bandwidth minimal
- Turn timers run server-side and are cleared immediately when all players guess correctly, preventing ghost timer calls

---

## Running Locally

### Prerequisites
- Node.js v18+
- npm

### Setup

**1. Clone the repo**
```bash
git clone https://github.com/mishmishel/skribbl-clone.git
cd skribbl-clone
```

**2. Start the backend**
```bash
cd server
npm install
node index.js
```
Server runs on `http://localhost:3001`

**3. Start the frontend**
```bash
cd client
npm install
npm run dev
```
App runs on `http://localhost:5173`

**4. Play**

Open two or more browser tabs at `http://localhost:5173`, create a room on one tab, and join with the room code on the others.

---

## Project Structure

```
skribbl-clone/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       │   ├── Canvas.jsx   # Drawing canvas with real-time sync
│       │   ├── Chat.jsx     # Guess input and message history
│       │   ├── Home.jsx     # Create/join room screen
│       │   ├── Lobby.jsx    # Pre-game waiting room
│       │   ├── PlayerList.jsx  # Live scores during game
│       │   └── Scoreboard.jsx  # Final results screen
│       ├── App.jsx          # Root component, shared state, socket listeners
│       └── socket.js        # Shared Socket.io client instance
└── server/
    ├── index.js             # Express server, Socket.io event handlers
    ├── gameState.js         # Room and game logic
    └── words.js             # Word bank
```

---

## What I Learned

This was my first full-stack project with real-time functionality. Key things I picked up:

- **WebSocket architecture** — understanding the difference between `socket.emit`, `socket.to().emit`, and `io.to().emit` and when to use each
- **State ownership** — keeping authoritative state on the server and treating the client as a display layer
- **Canvas API** — using `useRef` to interact with DOM elements directly in React, and handling coordinate scaling for responsive canvases
- **Node.js backend** — building a server; writing game logic, handling edge cases, etc.
- **Debugging distributed systems** — tracing bugs across client and server when events weren't firing as expected

---
