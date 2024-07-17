import React from 'react';
import Modal from 'react-modal';
import './MatchModal.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '600px',
    maxHeight: '90vh',
    padding: '20px',
    overflow: 'auto',
  },
};

Modal.setAppElement('#react-root');

const MatchModal = ({ isModalOpen, closeModal, selectedMatch, participants }) => {
  const isLongName = name => name && name.length > 10;

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Match Details"
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      {selectedMatch && (
        <>
          <div className="prediction-teams">
            <div className="team">
              <img src={selectedMatch.home_team_logo} alt={selectedMatch.home_team} className="team-logo" />
              <span className={`team-name ${isLongName(selectedMatch.home_team) ? 'long-name' : ''}`}>{selectedMatch.home_team}</span>
            </div>
            <span className="score">{selectedMatch.home_team_score || 0} - {selectedMatch.away_team_score || 0}</span>
            <div className="team">
              <span className={`team-name ${isLongName(selectedMatch.away_team) ? 'long-name' : ''}`}>{selectedMatch.away_team}</span>
              <img src={selectedMatch.away_team_logo} alt={selectedMatch.away_team} className="team-logo" />
            </div>
          </div>
          <h3 className="modal-subtitle">Participants and Predictions</h3>
          <table className="participants-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Prediction</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((user, index) => {
                const prediction = user.predictions.find(p => p.match_id === selectedMatch.id);
                return (
                  <tr key={user.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="player-info">
                        {user.profile_picture_url ? (
                          <img src={user.profile_picture_url} alt={user.first_name} className="profile-picture" />
                        ) : (
                          <div className="profile-placeholder">{user.email.charAt(0).toUpperCase()}</div>
                        )}
                        {user.first_name}
                      </div>
                    </td>
                    <td>{prediction ? `${prediction.home_team_score} - ${prediction.away_team_score}` : 'N/A'}</td>
                    <td>{prediction ? prediction.points : 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button className="close-button" onClick={closeModal}>Cerrar</button>
        </>
      )}
    </Modal>
  );
};

export default MatchModal;
