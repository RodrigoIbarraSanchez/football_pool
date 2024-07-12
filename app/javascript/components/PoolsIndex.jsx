import React from 'react';

const PoolsIndex = ({ pools, notice, userSignedIn, currentUser }) => {
  return (
    <div>
      {notice && <p style={{ color: 'green' }}>{notice}</p>}
      
      <h1>Pools</h1>
      
      <div id="pools">
        {pools.map(pool => (
          <div key={pool.id} id={`pool_${pool.id}`}>
            <p>
              <strong>Title:</strong> {pool.title}
            </p>
            <p>
              <strong>Description:</strong> {pool.description}
            </p>
            <p>
              <strong>Raffle winner:</strong> {pool.raffle_winner}
            </p>
            <p>
              <strong>Is started:</strong> {pool.isStarted ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Is finished:</strong> {pool.isFinished ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Prize:</strong> {pool.prize}
            </p>
            <p>
              <strong>User:</strong> {pool.user_id}
            </p>
            <p>
              <strong>Created at:</strong> {new Date(pool.created_at).toLocaleString()}
            </p>
            <p>
              <a href={`/pools/${pool.id}`}>Ver Quiniela</a>
            </p>
          </div>
        ))}
      </div>

      {userSignedIn && currentUser && currentUser.admin && (
        <div>
          <a href="/pools/new">New pool</a>
        </div>
      )}
    </div>
  );
};

export default PoolsIndex;
