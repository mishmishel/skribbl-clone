function Scoreboard({ finalScores, onGoHome }) {
    return (
      <div className="page">
        <h1 className="page-title">Game Over</h1>
        
        <div className="card" style={{ width: '400px', marginBottom: '24px' }}>
          <ul style={{ listStyle: 'none' }}>
            {finalScores.sort((a, b) => b.score - a.score).map((player, index) => (
              <li key={player.id} className="player-item" style={{ fontSize: '22px', padding: '8px 0' }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`} {player.username}: {player.score}
              </li>
            ))}
          </ul>
        </div>
  
        <div style={{ width: '400px', display: 'flex', justifyContent: 'center' }}>
          <button className='btn btn-grey' onClick={onGoHome}>home</button>
        </div>
      </div>
    )
  }
  
  export default Scoreboard