import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/Navigation.css';

const Navigation = ({ poolId }) => {
  return (
    <div className="navigation">
      <Link to={`/pools/${poolId}`}>Partidos</Link>
      <Link to={`/pools/${poolId}/leaderboard`}>Leaderboard</Link>
    </div>
  );
};

export default Navigation;
