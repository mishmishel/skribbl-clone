const { getRandomWord } = require('./words');

const rooms = {};

function createRoom(socketId, username) {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    rooms[code] = {
      code,
      players: [{ id: socketId, username, score: 0 }],
      hostId: socketId,
      currentDrawerIndex: 0,
      currentWord: null,
      roundNumber: 0,
      totalRounds: 3,
      gameOver: false,
      correctGuessers: [],
    };
    return rooms[code];
}

function joinRoom(roomCode, socketId, username) {
    const room = rooms[roomCode];
    if (!room) return null;
    room.players.push({ id: socketId, username, score: 0 });
    return room;
}

function nextTurn(roomCode) {
    const room = rooms[roomCode];
    const nextIndex = room.currentDrawerIndex + 1;
  
    if (nextIndex >= room.players.length) {
      // everyone has drawn this round
      room.roundNumber++;
      room.currentDrawerIndex = 0;
      if (room.roundNumber > room.totalRounds) {
        room.gameOver = true;
        return room;
      }
    } else {
      room.currentDrawerIndex = nextIndex;
    }
  
    room.currentWord = getRandomWord();
    room.correctGuessers = [];
    return room;
}

function checkGuess(roomCode, guess, socketId) {
    const room = rooms[roomCode];
    const isCorrect = guess.toLowerCase() === room.currentWord.toLowerCase();
    const alreadyGuessed = room.correctGuessers.includes(socketId);
  
    if (isCorrect && !alreadyGuessed) {
      room.correctGuessers.push(socketId);
      const player = room.players.find(p => p.id === socketId);
      if (player) player.score += 100;
      return { correct: true, scores: room.players.map(p => ({ username: p.username, score: p.score })) };
    }
  
    return { correct: false };
}

module.exports = { createRoom, joinRoom, nextTurn, checkGuess };