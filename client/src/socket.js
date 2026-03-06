import { io } from 'socket.io-client'
const URL = import.meta.env.MODE === 'production' 
  ? 'https://skribbl-clone-1-b4sg.onrender.com'
  : 'http://localhost:3001'

export const socket = io(URL)