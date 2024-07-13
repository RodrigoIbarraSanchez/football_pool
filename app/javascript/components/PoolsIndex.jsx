import React from 'react';
import '../stylesheets/PoolsIndex.css';

const PoolsIndex = ({ pools, notice, userSignedIn, currentUser }) => {
  return (
    <div className="container">
      {notice && <p className="notice">{notice}</p>}
      
      <h1 className="title">Quinielas</h1>
      
      <div id="pools" className="pools-list">
        {pools.map(pool => (
          <div key={pool.id} className="pool-item">
            <p><strong>Nombre:</strong> {pool.title}</p>
            <p><strong>Descripción:</strong> {pool.description}</p>
            {/* <p><strong>Raffle winner:</strong> {pool.raffle_winner}</p> */}
            {/* <p><strong>Iniciada?:</strong> {pool.isStarted ? 'Yes' : 'No'}</p> */}
            {/* <p><strong>Is finished:</strong> {pool.isFinished ? 'Yes' : 'No'}</p> */}
            <p><strong>Premio:</strong> {pool.prize}</p>
            {/* <p><strong>User:</strong> {pool.user_id}</p> */}
            {/* <p><strong>Created at:</strong> {new Date(pool.created_at).toLocaleString()}</p> */}
            <p><a href={`/pools/${pool.id}`} className="view-pool-link">Ver Quiniela</a></p>
          </div>
        ))}
      </div>

      {userSignedIn && currentUser && currentUser.admin && (
        <div className="creator-actions">
          <a href="/pools/new" className="new-pool-link">New pool</a>
        </div>
      )}
    </div>
  );
};

export default PoolsIndex;
