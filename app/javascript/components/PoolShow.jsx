import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import '../stylesheets/PoolShow.css';
import MatchModal from './modals/MatchModal';

const PoolShow = ({ pool, userIsCreator, userIsParticipant, notice, currentUser, csrfToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const location = useLocation();

  const userHasPredictions = currentUser.predictions.length > 0;

  const isLongName = name => name && name.length > 10;

  const userTotalPoints = currentUser.predictions.reduce((acc, prediction) => acc + prediction.points, 0);

  const openModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  // Eliminar duplicados en el array de matches
  const uniqueMatches = Array.from(new Set((pool.matches || []).map(match => match.id)))
    .map(id => {
      return (pool.matches || []).find(match => match.id === id);
    });

    console.log('pool:', pool);

  return (
    <div className="container">
      {notice && <p className="notice">{notice}</p>}
      <h1 className="title">{pool.title}</h1>

      <div className="tabs">
        <Link to={`/pools/${pool.id}`} className={`tab ${location.pathname === `/pools/${pool.id}` ? 'active' : ''}`}>Partidos</Link>
        <Link to={`/pools/${pool.id}/leaderboard`} className={`tab ${location.pathname === `/pools/${pool.id}/leaderboard` ? 'active' : ''}`}>Leaderboard</Link>
      </div>

      {location.pathname === `/pools/${pool.id}` && (
        <>
          {!userIsParticipant && (
            <button className="join-button" onClick={() => window.location.href = `/pools/${pool.id}/join`} disabled={pool.isStarted || pool.isFinished}>Join this pool</button>
          )}

          {userIsParticipant && (
            <>
              <div className='header'>
                <h3 className="subtitle">Tus Predicciones</h3>
                <h4 className="subtitle"><strong>{userTotalPoints}</strong> puntos</h4>
              </div>
              <ul className="predictions-list">
                {uniqueMatches.map(match => {
                  const prediction = currentUser.predictions.find(p => p.match_id === match.id);
                  if (!prediction) return null;
                  return (
                    <li key={match.id} className="prediction-item" onClick={() => openModal(match)}>
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
                          <span className={(match.status === 'FT' ? 'detail-score-ft': 'detail-score')}>{prediction ? prediction.home_team_score : '-'} - {prediction ? prediction.away_team_score : '-'}</span>
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

              {!userHasPredictions && (
                <>
                  <h3 className="subtitle">Completa tus predicciones</h3>
                  <form action="/predictions" method="post" className="predictions-form">
                    <input type="hidden" name="authenticity_token" value={csrfToken} />
                    {uniqueMatches.map(match => {
                      if (!currentUser.predictions.some(p => p.match_id === match.id)) {
                        return (
                          <div key={match.id} className="prediction-item">
                            <div className="prediction-teams">
                              <div className="team">
                                <img src={match.home_team_logo} alt={match.home_team} className="team-logo" />
                                <span className={`team-name ${isLongName(match.home_team) ? 'long-name' : ''}`}>{match.home_team}</span>
                              </div>
                              <input type="number" name="prediction[home_team_score][]" className="score-input" />
                              -
                              <input type="number" name="prediction[away_team_score][]" className="score-input" />
                              <div className="team">
                                <img src={match.away_team_logo} alt={match.away_team} className="team-logo" />
                                <span className={`team-name ${isLongName(match.away_team) ? 'long-name' : ''}`}>{match.away_team}</span>
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
        </>
      )}

      {!userIsParticipant && (
        <>
          <h2 className="subtitle">Matches</h2>
          {uniqueMatches && uniqueMatches.length > 0 ? (
            <ul className="predictions-list">
              {uniqueMatches.map(match => (
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

      <MatchModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedMatch={selectedMatch}
        participants={pool.participants || []}
        currentUser={currentUser}
      />
    </div>
  );
};

export default PoolShow;
