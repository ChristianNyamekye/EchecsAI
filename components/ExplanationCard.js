const ExplanationCard = ({ index, moveDetails, onGenerateSpeech }) => {
    const { title, player, implementation, relevance, funFact, speechUrl } = moveDetails;

    return (
        <div style={{ padding: '20px', margin: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h3>{title}</h3>
            <p><strong>Player:</strong> {player}</p>
            <ul>
                <li><strong>Ways to Implement:</strong> {implementation}</li>
                <li><strong>Relevance of Move:</strong> {relevance}</li>
                <li><strong>Fun Fact/Grandmasters:</strong> {funFact}</li>
            </ul>
            {speechUrl ? (
              <audio controls src={speechUrl}>
                Your browser does not support the audio element.
              </audio>
            ) : (
              <button onClick={() => onGenerateSpeech(index)}>Generate Speech</button>
            )}
        </div>
    );
};
