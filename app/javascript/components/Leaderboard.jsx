import React from 'react';
import '../stylesheets/Leaderboard.css';

const Leaderboard = ({ participants }) => {
  // Ordenar los participantes por puntos en orden descendente
  const sortedParticipants = participants.sort((a, b) => b.total_points - a.total_points);

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <h1 className="title">Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map((participant, index) => (
            <tr key={participant.id} className={`rank-${index + 1}`}>
              <td>{index + 1} {getRankEmoji(index + 1)}</td> {/* Columna de ranking */}
              <td>
                {participant.profile_picture_url && (
                  <img src={participant.profile_picture_url} alt="Profile" className="profile-picture" />
                )}
                {participant.username}
              </td>
              <td>{participant.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
