import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import '../stylesheets/PoolShow.css';
import MatchModal from './modals/MatchModal';
import Navbar from './Navbar';

const PoolShow = ({ pool, userIsCreator, userIsParticipant, userSignedIn, notice, currentUser, csrfToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editingPrediction, setEditingPrediction] = useState(null);
  const location = useLocation();

  const userHasPredictions = currentUser?.predictions?.length > 0;

  const isLongName = name => name && name.length > 10;

  const userTotalPoints = currentUser?.predictions?.reduce((acc, prediction) => acc + prediction?.points, 0);

  const openModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const handleEditClick = (prediction) => {
    setEditingPrediction(prediction);
  };

  const handleCancelClick = () => {
    setEditingPrediction(null);
  };

  // Función de comparación para ordenar partidos por fecha
  const compareMatchesByDate = (a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  };

  // Eliminar duplicados en el array de matches
  const uniqueMatches = Array.from(new Set((pool.matches || []).map(match => match.id)))
    .map(id => {
      return (pool.matches || []).find(match => match.id === id);
    })
    .sort(compareMatchesByDate); // Ordenar por fecha

  // Formato de fecha y hora para mejor UX
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const displayMatchInfo = (match) => {
    if (match.status === 'NS' || match.status === 'TBD') {
      return formatDateTime(match.date);
    } else if (match.status === 'FT') {
      return 'FT';
    } else if (match.status === 'PEN') {
      return 'PEN';
    } else {
      return `${match.elapsed}'`;
    }
  };

  console.log('pool.isStarted:', pool.isStarted);
  console.log('pool.isFinished:', pool.isFinished);

  return (
    <>
      <Navbar userSignedIn={userSignedIn} csrfToken={csrfToken} />
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
              <button className="main-button" onClick={() => window.location.href = `/pools/${pool.id}/join`} disabled={pool.isStarted || pool.isFinished}>Participar</button>
            )}

            {userIsParticipant && (
              <>
              {editingPrediction ? (
                <div className="edit-prediction-form">
                  <h3 className="subtitle">Editar Predicción</h3>
                  <form action={`/predictions/${editingPrediction.id}`} method="post">
                    <input type="hidden" name="_method" value="patch" />
                    <input type="hidden" name="authenticity_token" value={csrfToken} />
                    <div className="prediction-item">
                      <div className="prediction-teams">
                        <div className="team">
                          <img src={editingPrediction.home_team_logo} alt={editingPrediction.home_team} className="team-logo" />
                          <span className={`team-name ${isLongName(editingPrediction.home_team) ? 'long-name' : ''}`}>{editingPrediction.home_team}</span>
                        </div>
                        <input type="number" name="prediction[home_team_score]" className="score-input" defaultValue={editingPrediction.home_team_score} />
                        -
                        <input type="number" name="prediction[away_team_score]" className="score-input" defaultValue={editingPrediction.away_team_score} />
                        <div className="team">
                          <span className={`team-name ${isLongName(editingPrediction.away_team) ? 'long-name' : ''}`}>{editingPrediction.away_team}</span>
                          <img src={editingPrediction.away_team_logo} alt={editingPrediction.away_team} className="team-logo" />
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
                  {uniqueMatches.map(match => {
                    // const prediction = currentUser.predictions.find(p => p.match_id === match.id);
                    const prediction = currentUser.predictions.find(p => p.match_id === match.id && p.pool_id === pool.id);
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
                          displayMatchInfo(match)
                        } </span>
                        <div className="prediction-container" onClick={() => openModal(match)}  >
                          <div className="prediction-details">
                            <span className={(match.status === 'FT' ? 'detail-score-ft': 'detail-score')}>{prediction ? prediction.home_team_score : '-'} - {prediction ? prediction.away_team_score : '-'}</span>
                            {(match.status === 'FT' || match.status === 'PEN') && prediction && (
                              <span className={
                                prediction.points === 5 
                                  ? 'detail-points-5' 
                                  : (prediction.points === 3 ? 'detail-points-3' : 'detail-points')
                              }>
                                +{prediction.points}
                              </span>
                            )}
                          </div>
                        </div>
                        {(match.status === 'NS' || match.status === 'TBD') && (
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
                                  <span className={`team-name ${isLongName(match.away_team) ? 'long-name' : ''}`}>{match.away_team}</span>
                                  <img src={match.away_team_logo} alt={match.away_team} className="team-logo" />
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
                      displayMatchInfo(match)
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
    </>
  );
};

export default PoolShow;
