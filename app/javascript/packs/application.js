import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PoolsIndex from '../components/PoolsIndex';
import PoolShow from '../components/PoolShow';
import Leaderboard from '../components/Leaderboard';
import UserProfile from '../components/UserProfile';
import UserEditProfile from '../components/UserEditProfile';
import LandingPage from '../components/LandingPage';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('react-root');
  if (rootElement) {
    const props = JSON.parse(rootElement.getAttribute('data-props'));
    console.log("Props passed to React component:", props);
    const root = createRoot(rootElement);

    root.render(
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage userSignedIn={props.userSignedIn} />} />
          {props.userSignedIn && (
            <>
              <Route path="/pools" element={<PoolsIndex {...props} />} />
              <Route path="/pools/:id" element={<PoolShow {...props} />} />
              <Route path="/pools/:id/leaderboard" element={<Leaderboard pool={props.pool} {...props} />} />
              <Route path='/profile' element={<UserProfile user={props.currentUser} {...props} />} />
              <Route path="/profile/edit" element={<UserEditProfile user={props.currentUser} csrfToken={props.csrfToken} {...props} />} />
            </>
          )}
        </Routes>
      </Router>
    );
  }
});
