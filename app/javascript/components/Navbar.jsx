import React from 'react';
import '../stylesheets/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ userSignedIn, csrfToken }) => {
  console.log("Navbar component props:", userSignedIn);
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {userSignedIn ? (
          <Link to="/pools">🏟️ Futbol Desde el Palco</Link>
        ) : (
          <Link to="/">🏟️ Futbol Desde el Palco</Link>
        )}
      </div>
      <button className="navbar-toggler" onClick={() => document.getElementById('navbarMenu').classList.toggle('is-active')}>&#9776;</button>
      <div className="navbar-menu" id="navbarMenu">
        <Link to="/">Quinielas</Link>
        {userSignedIn && <Link to="/profile">Perfil</Link>}
        {/* <Link to="#">Contact</Link> */}
        {userSignedIn ? (
          <form action="/users/sign_out" method="post" className="logout-form">
            <input type="hidden" name="_method" value="delete" />
            <input type="hidden" name="authenticity_token" value={csrfToken} />
            <button type="submit" className="logout-link">Cerrar Sesión</button>
          </form>
        ) : (
          <>
            <Link to="/users/sign_in">Iniciar Sesión</Link>
            <Link to="/users/sign_up">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
