import React from 'react';
import '../stylesheets/PoolShow.css';

const PoolShow = ({ pool, userIsCreator, userIsParticipant, notice, currentUser }) => {
  const userHasPredictions = currentUser.predictions.length > 0;

  const isLongName = name => name.length > 10; // Ajusta este valor según lo que consideres un nombre largo

  return (
    <div className="container">
      {notice && <p className="notice">{notice}</p>}
      <h1 className="title">{pool.title}</h1>

      {!userIsCreator && !userIsParticipant && (
        <button className="join-button" onClick={() => window.location.href = `/pools/${pool.id}/join`}>Join this pool</button>
      )}

      {userIsParticipant && (
        <>
          <h3 className="subtitle">Tus Predicciones</h3>
          <ul className="predictions-list">
            {pool.matches.map(match => {
              const prediction = currentUser.predictions.find(p => p.match_id === match.id);
              return (
                <li key={match.id} className="prediction-item">
                  <div className="prediction-teams">
                    <div className="team">
                      <img src={match.home_team_logo} alt={match.home_team} className="team-logo" />
                      <span className={`team-name ${isLongName(match.home_team) ? 'long-name' : ''}`}>{match.home_team}</span>
                    </div>
                    <span className="score">{match.home_team_score || 0} - {match.away_team_score || 0}</span>
                    <div className="team">
                      <span className={`team-name ${isLongName(match.away_team) ? 'long-name' : ''}`}>{match.away_team}</span>
                      <img src={match.away_team_logo} alt={match.away_team} className="team-logo" />
                    </div>
                  </div>
                  <span className={(match.status === '1H' || match.status === '2H') ? 'elapsed-status-live' : 'elapsed-status'}>{
                    match.status === 'NS' ? 'NS' : match.status === 'FT' ? 'FT' : `${match.elapsed}'`
                  } </span>
                  <div className="prediction-container">
                    <div className="prediction-details">
                      <span className="detail-score">{prediction ? prediction.home_team_score : '-'} - {prediction ? prediction.away_team_score : '-'}</span>
                      { match.status === 'FT' && prediction && <span className="detail-points">+5</span> }
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="details">
            <p><strong>Descripción:</strong> {pool.description}</p>
            <p><strong>Premio:</strong> {pool.prize}</p>
          </div>

          {pool.matches.some(match => !currentUser.predictions.some(p => p.match_id === match.id)) && (
            <>
              <h3 className="subtitle">Enviar Tus Predicciones</h3>
              <form action="/predictions" method="post" className="predictions-form">
                {pool.matches.map(match => {
                  if (!currentUser.predictions.some(p => p.match_id === match.id)) {
                    return (
                      <div key={match.id} className="prediction-input">
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
                <button type="submit" className="submit-button">Submit Predictions</button>
              </form>
            </>
          )}
        </>
      )}

      {!userHasPredictions && (
        <>
          <h2 className="subtitle">Matches</h2>
          {pool.matches.length > 0 ? (
            <ul className="matches-list">
              {pool.matches.map(match => (
                <li key={match.id} className="match-item">
                  <div className="match-teams">
                    <span className="team-name">{match.home_team}</span>
                    <span className="score"> vs </span>
                    <span className="team-name">{match.away_team}</span>
                  </div>
                  <div className="match-details">
                    <span>{match.venue}</span>
                    <span>{new Date(match.date).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-matches">No matches available.</p>
          )}
        </>
      )}

      {userIsCreator ? (
        <div className="creator-actions">
          <a href={`/pools/${pool.id}/edit`}>Edit this pool</a> | 
          <a href="/pools">Back to pools</a> | 
          <form action={`/pools/${pool.id}`} method="post" style={{ display: 'inline' }}>
            <input type="hidden" name="_method" value="delete" />
            <button type="submit">Destroy this pool</button>
          </form>
        </div>
      ) : (
        <div className="back-to-pools">
          <a href="/pools">Back to pools</a>
        </div>
      )}
    </div>
  );
};

export default PoolShow;
