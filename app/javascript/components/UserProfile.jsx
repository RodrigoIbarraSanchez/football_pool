import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/UserProfile.css';
import Navbar from './Navbar';

const UserProfile = ({ user, userSignedIn, csrfToken }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <>
      <Navbar userSignedIn={userSignedIn} csrfToken={csrfToken} />
      <div className="user-profile">
        <div className="profile-picture-container">
          {user.profile_picture_url ? (
            <img src={user.profile_picture_url} alt="Profile Picture" className="profile-picture" />
          ) : (
            <div className="profile-placeholder">{user.first_name.charAt(0).toUpperCase()}</div>
          )}
        </div>
        <h1>{user.first_name} {user.last_name}</h1>
        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
        <button className="edit-profile-button" onClick={handleEditProfile}>Editar Perfil</button>
      </div>
    </>
  );
};

export default UserProfile;
