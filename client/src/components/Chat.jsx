import { socket } from '../socket'
import { useState, useEffect } from 'react'

function Chat({ roomCode, username, isDrawer }) {
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        socket.on('chat-message', ({ username, message }) => {
          setMessages(prev => [...prev, { username, message, correct: false }])
        })
      
        socket.on('correct-guess', ({ username, scores }) => {
          setMessages(prev => [...prev, { username, message: 'guessed correctly!', correct: true }])
        })
      
        return () => {
          socket.off('chat-message')
          socket.off('correct-guess')
        }
    }, [])

    function handleGuess() {
        if (!inputValue.trim()) return
        socket.emit('guess', { roomCode, guess: inputValue, username })
        setInputValue('') // clear input post guess
    }

    return (
        <div>
            <div>
                <ul>
                {messages.map((msg, index) => (
                    <li key={index} style={{ color: msg.correct ? 'green' : 'black' }}>
                    {msg.username}: {msg.message}
                    </li>
                ))}
                </ul>
            </div>
            <div>
                { !isDrawer &&
                (<div>
                    <input
                    type="text"
                    placeholder="Enter your guess"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />

                  <button onClick={handleGuess}>Guess</button>
                  </div>
                )}
            </div>
        </div>
    )
}

export default Chat