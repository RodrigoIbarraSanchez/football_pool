import React from 'react';

const PoolShow = ({ pool, userIsCreator, userIsParticipant, notice, currentUser }) => {
  return (
    <div>
      {notice && <p style={{ color: 'green' }}>{notice}</p>}
      <h1>{pool.title}</h1>
      <p><strong>Description:</strong> {pool.description}</p>
      <p><strong>Raffle winner:</strong> {pool.raffle_winner}</p>
      <p><strong>Is started:</strong> {pool.isStarted ? 'Yes' : 'No'}</p>
      <p><strong>Is finished:</strong> {pool.isFinished ? 'Yes' : 'No'}</p>
      <p><strong>Prize:</strong> {pool.prize}</p>
      <p><strong>User:</strong> {pool.user_id}</p>
      <p><strong>Created at:</strong> {new Date(pool.created_at).toLocaleString()}</p>

      <h2>Matches</h2>
      {pool.matches.length > 0 ? (
        <ul>
          {pool.matches.map(match => (
            <li key={match.id}>
              {match.home_team} vs {match.away_team} at {match.venue} on {new Date(match.date).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches available.</p>
      )}

      {!userIsCreator && !userIsParticipant && (
        <button onClick={() => window.location.href = `/pools/${pool.id}/join`}>Join this pool</button>
      )}

      {userIsParticipant && (
        <>
          <h3>Your Predictions</h3>
          <ul>
            {pool.matches.map(match => {
              const prediction = currentUser.predictions.find(p => p.match_id === match.id);
              return (
                <li key={match.id}>
                  <p>{match.home_team} vs {match.away_team}</p>
                  {prediction ? (
                    <>
                      <p>Home Team Score: {prediction.home_team_score}</p>
                      <p>Away Team Score: {prediction.away_team_score}</p>
                    </>
                  ) : (
                    <p>No prediction submitted</p>
                  )}
                </li>
              );
            })}
          </ul>

          {pool.matches.some(match => !currentUser.predictions.some(p => p.match_id === match.id)) && (
            <>
              <h3>Submit New Predictions</h3>
              <form action="/predictions" method="post">
                {pool.matches.map(match => {
                  if (!currentUser.predictions.some(p => p.match_id === match.id)) {
                    return (
                      <div key={match.id}>
                        <p>{match.home_team} vs {match.away_team}</p>
                        <input type="hidden" name="prediction[match_id][]" value={match.id} />
                        <input type="hidden" name="prediction[pool_id][]" value={pool.id} />
                        <div>
                          <label>Home Team Score</label>
                          <input type="number" name="prediction[home_team_score][]" />
                        </div>
                        <div>
                          <label>Away Team Score</label>
                          <input type="number" name="prediction[away_team_score][]" />
                        </div>
                      </div>
                    );
                  }
                })}
                <button type="submit">Submit Predictions</button>
              </form>
            </>
          )}
        </>
      )}

      {userIsCreator ? (
        <div>
          <a href={`/pools/${pool.id}/edit`}>Edit this pool</a> | 
          <a href="/pools">Back to pools</a> | 
          <form action={`/pools/${pool.id}`} method="post" style={{ display: 'inline' }}>
            <input type="hidden" name="_method" value="delete" />
            <button type="submit">Destroy this pool</button>
          </form>
        </div>
      ) : (
        <div>
          <a href="/pools">Back to pools</a>
        </div>
      )}
    </div>
  );
};

export default PoolShow;
