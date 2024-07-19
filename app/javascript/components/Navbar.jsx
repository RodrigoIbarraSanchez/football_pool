import React from 'react';
import '../stylesheets/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ userSignedIn, csrfToken }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">🏟️ Futbol Desde el Palco</a>
      </div>
      <button className="navbar-toggler" onClick={() => document.getElementById('navbarMenu').classList.toggle('is-active')}>&#9776;</button>
      <div className="navbar-menu" id="navbarMenu">
        <a href="/">Quinielas</a>
        {userSignedIn && <a href="/profile">Perfil</a>}
        {/* <a href="#">Contact</a> */}
        {userSignedIn ? (
          <form action="/users/sign_out" method="post" className="logout-form">
            <input type="hidden" name="_method" value="delete" />
            <input type="hidden" name="authenticity_token" value={csrfToken} />
            <button type="submit" className="logout-link">Cerrar Sesión</button>
          </form>
        ) : (
          <>
            <a href="/users/sign_in">Iniciar Sesión</a>
            <a href="/users/sign_up">Registrarse</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
