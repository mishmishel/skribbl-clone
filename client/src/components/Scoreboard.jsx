function Scoreboard({ finalScores, onGoHome }) {
    return (
        <div>
            <h1>Scoreboard</h1>
            <ul>
            {finalScores.sort((a, b) => b.score - a.score).map((player, index) => (
            <li key={player.id}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`} {player.username}: {player.score}
            </li>
            ))}
            </ul>
            <button onClick={onGoHome}>Go Home</button>
        </div>
    )
}

export default Scoreboard