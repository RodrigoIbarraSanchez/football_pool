import React, { useState } from 'react';
import '../stylesheets/PoolShow.css';

const PoolShow = ({ pool, userIsCreator, userIsParticipant, notice, currentUser, csrfToken }) => {
  const [editingPrediction, setEditingPrediction] = useState(null);

  const userHasPredictions = currentUser.predictions.length > 0;

  const isLongName = name => name && name.length > 10;  // Ajusta este valor según lo que consideres un nombre largo

  const userTotalPoints = currentUser.predictions.reduce((acc, prediction) => acc + prediction.points, 0);

  const handleEditClick = (prediction) => {
    setEditingPrediction(prediction);
  };

  const handleCancelClick = () => {
    setEditingPrediction(null);
  };

  return (
    <div className="container">
      {notice && <p className="notice">{notice}</p>}
      <h1 className="title">{pool.title}</h1>

      {!userIsParticipant && !pool.isStarted && (
        <button className="join-button" onClick={() => window.location.href = `/pools/${pool.id}/join`}>Unirme a esta Quiniela</button>
      )}

      {userIsParticipant && (
        <>
          {editingPrediction ? (
            <div className="edit-prediction-form">
              <h3 className="subtitle">Editar Predicción</h3>
              <form action={`/predictions/${editingPrediction.id}`} method="post">
                <input type="hidden" name="_method" value="patch" />
                <input type="hidden" name="authenticity_token" value={csrfToken} />
                <input type="hidden" name="id" value={editingPrediction.id} />
                <div className="prediction-item">
                  <div className="prediction-teams">
                    <div className="team">
                      <img src={editingPrediction.match.home_team_logo} alt={editingPrediction.match.home_team} className="team-logo" />
                      <span className={`team-name ${isLongName(editingPrediction.match.home_team) ? 'long-name' : ''}`}>{editingPrediction.match.home_team}</span>
                    </div>
                    <input type="number" name="prediction[home_team_score]" className="score-input" defaultValue={editingPrediction.home_team_score} />
                    -
                    <input type="number" name="prediction[away_team_score]" className="score-input" defaultValue={editingPrediction.away_team_score} />
                    <div className="team">
                      <span className={`team-name ${isLongName(editingPrediction.match.away_team) ? 'long-name' : ''}`}>{editingPrediction.match.away_team}</span>
                      <img src={editingPrediction.match.away_team_logo} alt={editingPrediction.match.away_team} className="team-logo" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="submit-button">Guardar cambios</button>
                <button type="button" className="cancel-button" onClick={handleCancelClick}>Cancelar</button>
              </form>
            </div>
          ) : (
            <>
              <div className='header'>
                <h3 className="subtitle">Tus Predicciones</h3>
                <h4 className="subtitle"><strong>{userTotalPoints}</strong> puntos</h4>
              </div>
              <ul className="predictions-list">
                {pool.matches.map(match => {
                  const prediction = currentUser.predictions.find(p => p.match_id === match.id);
                  if (!prediction) return null;
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
                          <span className={(match.status === 'FT' ? 'detail-score-ft' : 'detail-score')}>{prediction ? prediction.home_team_score : '-'} - {prediction ? prediction.away_team_score : '-'}</span>
                          {match.status === 'FT' && prediction && <span className={(prediction.points === 5 || prediction.points === 2 ? 'detail-points-5' : 'detail-points')}>+{prediction.points}</span>}
                        </div>
                      </div>
                      {match.status === 'NS' && (
                        <button className="edit-button" onClick={() => handleEditClick({ ...prediction, match })}>Editar</button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {!userHasPredictions && (
            <>
              <h3 className="subtitle">Completa tus predicciones</h3>
              <form action="/predictions" method="post" className="predictions-form">
                <input type="hidden" name="authenticity_token" value={csrfToken} />
                {pool.matches.map(match => {
                  if (!currentUser.predictions.some(p => p.match_id === match.id)) {
                    return (
                      <div key={match.id} className="prediction-item">
                        <div className="prediction-teams">
                          <div className="team">
                            <img src={match.home_team_logo} alt={match.home_team} className="team-logo" />
                            <span className={`team-name ${isLongName(match.home_team) ? 'long-name' : ''}`}>{match.home_team}</span>
                          </div>
                          <div className="score-input">
                            <input type="number" name="prediction[home_team_score][]" className="score-input-field" />
                          </div>
                          <div className="team">
                            <img src={match.away_team_logo} alt={match.away_team} className="team-logo" />
                            <span className={`team-name ${isLongName(match.away_team) ? 'long-name' : ''}`}>{match.away_team}</span>
                          </div>
                          <div className="score-input">
                            <input type="number" name="prediction[away_team_score][]" className="score-input-field" />
                          </div>
                        </div>
                        <input type="hidden" name="prediction[match_id][]" value={match.id} />
                        <input type="hidden" name="prediction[pool_id][]" value={pool.id} />
                      </div>
                    );
                  }
                })}
                <button type="submit" className="submit-button">Guardar predicciones</button>
              </form>
            </>
          )}
        </>
      )}

      {!userIsParticipant && (
        <>
          <h2 className="subtitle">Matches</h2>
          {pool.matches.length > 0 ? (
            <ul className="predictions-list">
              {pool.matches.map(match => (
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
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-matches">No matches available.</p>
          )}
        </>
      )}

      {userIsCreator && (
        <div className="creator-actions">
          <a href={`/pools/${pool.id}/edit`}>Edit this pool</a> | 
          <a href="/pools">Back to pools</a> | 
          <form action={`/pools/${pool.id}`} method="post" style={{ display: 'inline' }}>
            <input type="hidden" name="_method" value="delete" />
            <button type="submit">Destroy this pool</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PoolShow;
