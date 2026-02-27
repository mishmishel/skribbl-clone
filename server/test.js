const { createRoom, joinRoom, nextTurn, checkGuess } = require('./gameState');

// Test createRoom
const room = createRoom('socket123', 'Alice');
console.log('Room created, room code:', room.code); // should print a 4-letter code

// Test joinRoom
const joined = joinRoom(room.code, 'socket456', 'Bob');
console.log('Bob joined, current number of players:', joined.players.length); // should print 2

// Test nextTurn
const turn = nextTurn(room.code);
console.log('Current word:', turn.currentWord); // should print a word
console.log('Current drawer index:', turn.currentDrawerIndex);

// Test checkGuess - wrong guess
const wrong = checkGuess(room.code, 'wrongword', 'socket456');
console.log('Tested wrong guess, should print false:', wrong.correct); // should print false

// Test checkGuess - correct guess
const correct = checkGuess(room.code, turn.currentWord, 'socket456');
console.log('Test correct guess, should print true:', correct.correct); // should print true
console.log('Scores:', correct.scores); // should show Bob with 100 points