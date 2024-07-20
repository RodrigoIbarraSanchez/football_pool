import React, { useState } from 'react';
import '../stylesheets/UserEditProfile.css';

const UserEditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [username, setUsername] = useState(user.username);
  const [profilePicture, setProfilePicture] = useState(null);
  const [errors, setErrors] = useState([]);
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('user[first_name]', firstName);
    formData.append('user[last_name]', lastName);
    formData.append('user[username]', username);
    if (profilePicture) {
      formData.append('user[profile_picture]', profilePicture);
    }

    fetch('/profile', {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          window.location.href = '/profile';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrors(['An unexpected error occurred. Please try again.']);
      });
  };

  return (
    <div className="user-edit-profile">
      <h1>Edit Profile</h1>
      {errors.length > 0 && (
        <div className="errors">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profile_picture">Profile Picture</label>
          <input
            type="file"
            id="profile_picture"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => window.location.href = '/profile'}>Cancel</button>
      </form>
    </div>
  );
};

export default UserEditProfile;
