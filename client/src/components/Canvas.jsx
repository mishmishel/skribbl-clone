import { useRef, useEffect } from 'react'
import { socket } from '../socket'

function Canvas({ roomCode, isDrawer }) {
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    function getPos(e) {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
    }

    function startDrawing(e) {
      if (!isDrawer) return
      isDrawing.current = true
      const pos = getPos(e)
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    
      // emit the start of a new stroke
      socket.emit('draw', {
        roomCode,
        drawData: { x: pos.x, y: pos.y, type: 'start' }
      })
    }

    function draw(e) {
      if (!isDrawing.current || !isDrawer) return
      const pos = getPos(e)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()

      socket.emit('draw', {
        roomCode,
        drawData: {
          x: pos.x,
          y: pos.y,
          color: ctx.strokeStyle,
          lineWidth: ctx.lineWidth,
          type: 'draw'
        }
      })
    }

    function stopDrawing() {
      if (!isDrawing.current) return
      isDrawing.current = false
      ctx.beginPath()
    }

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseleave', stopDrawing)

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('mouseleave', stopDrawing)
    }
  }, [isDrawer, roomCode])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
  
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  
    socket.on('draw', (drawData) => {
      if (drawData.type === 'start') {
        ctx.beginPath()
        ctx.moveTo(drawData.x, drawData.y)
      } else {
        ctx.strokeStyle = drawData.color
        ctx.lineWidth = drawData.lineWidth
        ctx.lineTo(drawData.x, drawData.y)
        ctx.stroke()
      }
    })

    socket.on('next-turn', () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    })
  
    return () => {
      socket.off('draw')
      socket.off('next-turn')
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={650}
      style={{
        border: 'none',
        borderRadius: '24px',
        background: 'white',
        cursor: isDrawer ? 'crosshair' : 'default',
        width: '100%',
        height: '100%',
      }}
  />
  )
}

export default Canvas