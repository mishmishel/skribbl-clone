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
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
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
  
    return () => socket.off('draw')
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '1px solid black', cursor: isDrawer ? 'crosshair' : 'default' }}
    />
  )
}

export default Canvas