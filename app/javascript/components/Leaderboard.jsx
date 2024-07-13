import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import '../stylesheets/Leaderboard.css';
import { Link } from 'react-router-dom';

const Leaderboard = ({ pool }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (pool && pool.id) {
      fetch(`/pools/${pool.id}/leaderboard.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data && data.participants) {
            setParticipants(data.participants);
          }
        })
        .catch(error => {
          console.error('Error loading leaderboard data:', error);
        });
    }
  }, [pool]);

  if (!participants || participants.length === 0) return <div>No participants data</div>;

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
    <>
      <div className="tabs">
        <Link to={`/pools/${pool.id}`} className={`tab ${location.pathname === `/pools/${pool.id}` ? 'active' : ''}`}>Partidos</Link>
        <Link to={`/pools/${pool.id}/leaderboard`} className={`tab ${location.pathname === `/pools/${pool.id}/leaderboard` ? 'active' : ''}`}>Leaderboard</Link>
      </div>
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
                <td>{index + 1} {getRankEmoji(index + 1)}</td>
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
    </>
  );
};

export default Leaderboard;
