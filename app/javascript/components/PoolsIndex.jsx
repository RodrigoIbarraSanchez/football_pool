import React from 'react';
import Navbar from './Navbar'; // Ajusta la ruta según sea necesario
import '../stylesheets/PoolsIndex.css';

const PoolsIndex = ({ pools, notice, userSignedIn, currentUser, csrfToken }) => {
  return (
    <>
      <Navbar userSignedIn={userSignedIn} csrfToken={csrfToken} />
      <div className="container">
        {notice && <p className="notice">{notice}</p>}
        
        <h1 className="title">Quinielas</h1>
        
        <div id="pools" className="pools-list">
          {pools
            .filter(pool => pool.isPublic && !pool.isFinished)
            .map(pool => (
              <div key={pool.id} className="pool-item">
                <p><strong>Nombre:</strong> {pool.title}</p>
                <p><strong>Descripción:</strong> {pool.description}</p>
                <p><strong>Premio:</strong> {pool.prize}</p>
                <button className="main-button" onClick={() => window.location.href = `/pools/${pool.id}`}>Ver Quiniela</button>
              </div>
          ))}
        </div>

        {userSignedIn && currentUser && currentUser.admin && (
          <div className="creator-actions">
            <a href="/pools/new" className="new-pool-link">New pool</a>
          </div>
        )}
      </div>
    </>
  );
};

export default PoolsIndex;
