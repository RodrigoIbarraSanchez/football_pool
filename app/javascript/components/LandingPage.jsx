import React from 'react';
import '../stylesheets/LandingPage.css';
import ssImage1 from '../../assets/images/ss-1.png';
import ssImage2 from '../../assets/images/ss-2.png';
import ssSorteo1 from '../../assets/images/sorteo-1.png';
import ssSorteo2 from '../../assets/images/sorteo-2.png';
import ssSorteo3 from '../../assets/images/sorteo-3.png';

const LandingPage = ({ userSignedIn }) => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Quinielas de Futbol cada semana</h1>
          <p>Entrada: $100 MXN - Bolsa Asegurada: $1,000 MXN</p>
          <p>Pocos Particippantes (Menos de 20).</p>
          <p>Mejores premios y costos más bajos cada semana con más participantes.</p>
          <p>¡Regístrate y comienza a jugar!</p>
          {userSignedIn ? (
            <div className="cta-buttons">
              <button onClick={() => window.location.href = '/pools'}>Ver Quinielas</button>
            </div>
          ) : (
            <div className="cta-buttons">
              <button onClick={() => window.location.href = '/users/sign_in'}>Iniciar Sesión</button>
              <button onClick={() => window.location.href = '/users/sign_up'}>Registrarme</button>
            </div>
          )}
        </div>
        <img src={ssImage1} alt="Quiniela en iPhone" className="ss-image1"/>
        <img src={ssImage2} alt="Quiniela en iPhone" className="ss-image2"/>
      </header>

      <section className="benefits-section">
        <h2>¿Cómo participar?</h2>
        <div className="benefits">
          <div className="benefit">
            <h3>1. Enviar comprobante de pago en Telegram</h3>
            <p>Tenemos una comunidad en Telegram donde estamos solamente fanáticos del futbol, ahí tenemos un canal llamado "Registro de Quinielas" donde los participantes envían su captura de pago.</p>
            <button className='telegram-btn' onClick={() => window.open('https://t.me/futboldesdeelpalco/1', '_blank')}>Unirme a la comunidad en Telegram</button>
          </div>
          <div className="benefit">
            <h3>2. Llenas tu Quiniela</h3>
            <p>En un proceso sencillo y 100% digital llenas tu quiniela, los pronósticos pueden ser editados hasta segundos antes del comienzo de cada partido. Puedes ver los pronósticos de los demás una vez el partido haya iniciado o terminado. Somos 100% transparentes.</p>
          </div>
          <div className="benefit">
            <h3>3. Ves los resultados en tiempo real</h3>
            <p>Todos los participantes pueden ver los resultados en vivo así como la tabla de participantes y puntos de cada quien 100% real y online sin aburridas hojas de cálculo o archivos .pdf</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section mobile-title">
        <h2>Lo Que Dicen Nuestros Participantes</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"Ya he ganado un par de veces y me gusta que no es difícil ganar aquí porque no son miles de personas participando."</p>
            <p>- Polo S.</p>
          </div>
          <div className="testimonial">
            <p>"Todo se hace en la página web y me gusta que cada que termina un partido se actualiza la tabla de participantes, no hay que esperar."</p>
            <p>- Damian R.</p>
          </div>
          <div className="testimonial">
            <p>"Aunque no sepas mucho de futbol hay sorteos de pizzas, tarjetas de Amazon y más cosas y tienes más oportunidades de ganar por un costo muy bajo."</p>
            <p>- Manuel M.</p>
          </div>
        </div>
      </section>
      
      <section className="testimonials-section mobile-title">
        <h2>Tenemos Premios y Sorteos Cada Semana</h2>
        <div>
          <div className="raffle">
            <img src={ssSorteo1} alt="Sorteo 1" />
          </div>
          <div className="raffle">
            <img src={ssSorteo2} alt="Sorteo 2" />
          </div>
          <div className="raffle">
            <img src={ssSorteo3} alt="Sorteo 3" />
          </div>
        </div>
      </section>

      <footer className="hero-section">
        <div className="hero-content">
          <h1>¡Tu primer quiniela es 100% GRATIS! 🎁</h1>
          <p>¡Regístrate y comienza a jugar!</p>
          {userSignedIn ? (
            <div className="cta-buttons">
              <button onClick={() => window.location.href = '/pools'}>Ver Quinielas</button>
            </div>
          ) : (
            <div className="cta-buttons">
              <button onClick={() => window.location.href = '/users/sign_in'}>Iniciar Sesión</button>
              <button onClick={() => window.location.href = '/users/sign_up'}>Registrarme</button>
            </div>
          )}
        </div>
        <img src={ssImage1} alt="Quiniela en iPhone" className="ss-image1"/>
        <img src={ssImage2} alt="Quiniela en iPhone" className="ss-image2"/>
      </footer>
    </div>
  );
};

export default LandingPage;
