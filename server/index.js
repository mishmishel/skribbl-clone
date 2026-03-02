const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createRoom, joinRoom, nextTurn, checkGuess, rooms } = require('./gameState');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {

  socket.on('create-room', ({ username }, callback) => {
    const room = createRoom(socket.id, username);
    socket.join(room.code);
    callback({ roomCode: room.code, playerId: socket.id, players: room.players });
  });

  socket.on('join-room', ({ roomCode, username }, callback) => {
    const room = joinRoom(roomCode, socket.id, username);
    if (!room) return callback({ error: 'Room not found' });
    socket.join(roomCode);
    io.to(roomCode).emit('room-update', room);
    callback({ room });
  });

  socket.on('start-game', ({ roomCode }) => {
    const room = nextTurn(roomCode);
    io.to(roomCode).emit('game-started', room);
    startTurnTimer(roomCode);
  });

  socket.on('draw', ({ roomCode, drawData }) => {
    socket.to(roomCode).emit('draw', drawData); // broadcast to everyone else
  });

  socket.on('guess', ({ roomCode, guess, username }) => {
    const result = checkGuess(roomCode, guess, socket.id);
    if (result.correct) {
      io.to(roomCode).emit('correct-guess', { username, scores: result.scores });
    } else {
      io.to(roomCode).emit('chat-message', { username, message: guess });
    }
  });

  socket.on('leave-room', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;
  
    room.players = room.players.filter(p => p.id !== socket.id);
    socket.leave(roomCode);
  
    if (room.players.length === 0) {
      delete rooms[roomCode];
    } else {
      if (room.hostId === socket.id) {
        room.hostId = room.players[0].id;
      }
      io.to(roomCode).emit('room-update', room);
    }
  });

  socket.on('disconnect', () => {
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          delete rooms[roomCode];
        } else {
          // transfer host if needed
          if (room.hostId === socket.id) {
            room.hostId = room.players[0].id;
          }
          io.to(roomCode).emit('room-update', room);
        }
        break;
      }
    }
  })
});

function startTurnTimer(roomCode) {
  let timeLeft = 80;
  const interval = setInterval(() => {
    io.to(roomCode).emit('timer', { timeLeft });
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(interval);
      const room = nextTurn(roomCode);
      if (room.gameOver) {
        io.to(roomCode).emit('game-over', room);
      } else {
        io.to(roomCode).emit('next-turn', room);
        startTurnTimer(roomCode);
      }
    }
  }, 1000);
}

server.listen(3001, () => console.log('Server running on port 3001'));