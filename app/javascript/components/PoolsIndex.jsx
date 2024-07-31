import React, { useEffect } from 'react';
import Navbar from './Navbar'; // Ajusta la ruta según sea necesario
import '../stylesheets/PoolsIndex.css';

const PoolsIndex = ({ pools, notice, userSignedIn, currentUser, csrfToken }) => {
  const filteredPools = pools.filter(pool => pool.isPublic && !pool.isFinished);

  console.log('All Pools:', pools);
  console.log('Filtered Pools:', filteredPools);
  
  return (
    <>
      <Navbar userSignedIn={userSignedIn} csrfToken={csrfToken} />
      <h4 className='steps-title'>Pasos para participar:</h4>
      <div className="steps-box">
        <div className="step">
          <h2>1</h2>
          <p>Llena tu Quiniela</p>
        </div>
        <div className="step">
          <h2>2</h2>
          <button className='telegram-btn-steps' onClick={() => window.open('https://t.me/futboldesdeelpalco/73', '_blank')}>Envía comprobante de pago a Telegram</button>
        </div>
        <div className="step">
          <h2>3</h2>
          <p>Sumar puntos con tus pronósticos y ganar</p>
        </div>
      </div>
      <div className="container">
        {notice && <p className="notice">{notice}</p>}

        
        <h1 className="title">Quinielas</h1>
        
        <div id="pools" className="pools-list">
          {filteredPools.map(pool => (
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
