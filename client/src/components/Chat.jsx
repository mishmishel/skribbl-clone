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

        socket.on('next-turn', () => {
            setMessages([])
        })
      
        return () => {
          socket.off('chat-message')
          socket.off('correct-guess')
          socket.off('next-turn')
        }
    }, [])

    function handleGuess() {
        if (!inputValue.trim()) return
        socket.emit('guess', { roomCode, guess: inputValue, username })
        setInputValue('') // clear input post guess
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleGuess()
    }

    return (
        <div className="card" style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '0px'
          }}>
            <ul className="chat-messages">
              {messages.map((msg, index) => (
                <li key={index} className={`chat-message ${msg.correct ? 'correct' : ''}`}>
                  {msg.username}: {msg.message}
                </li>
              ))}
            </ul>
            {!isDrawer && (
                <div className="chat-input-row">
                    <input
                    className="input"
                    type="text"
                    placeholder="type your guess..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    />
                    <button 
                    onClick={handleGuess}
                    style={{
                        flexShrink: 0,
                        background: '#7ef0a0',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '8px 16px',
                        fontFamily: 'Margarine, sans-serif',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                    >
                    go
                    </button>
                </div>
            )}
        </div>
    )

}

export default Chat