import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { salvaTema } from '../sessione';
import { useUtente } from '../utente-context';
import './Navbar.css';

type Tema = 'light' | 'dark';

function temaIniziale(): Tema {
    const salvato = document.documentElement.dataset.theme;
    if (salvato === 'light' || salvato === 'dark') return salvato;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function Navbar() {
    const { utente, apriAccesso, esci } = useUtente();
    const [tema, setTema] = useState<Tema>(temaIniziale);

    function cambiaTema() {
        const nuovo = tema === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nuovo;
        salvaTema(nuovo);
        setTema(nuovo);
    }

    return (
        <header className="navbar">
            <div className="navbar-marchi">
                <Link to="/" className="navbar-logo">ArenaHub</Link>
                <a
                    href="https://www.laziodigital.it/"
                    target="_blank"
                    rel="noreferrer"
                    className="navbar-its"
                    aria-label="Lazio Digital ITS Academy"
                >
                    <img className="its-scuro" src="/img/its-scuro.png" alt="" width="1223" height="220" />
                    <img className="its-chiaro" src="/img/its-chiaro.png" alt="" width="1223" height="220" />
                </a>
            </div>
            <nav>
                <ul className="navbar-links">
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="/tornei">Tornei</NavLink></li>
                    <li><NavLink to="/classifiche">Classifiche</NavLink></li>
                    <li className="navbar-destra">
                        <button
                            className={`navbar-tema is-${tema}`}
                            onClick={cambiaTema}
                            aria-label={tema === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
                            title={tema === 'dark' ? 'Tema chiaro' : 'Tema scuro'}
                        >
                            <svg className="tema-sole" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="4.5" />
                                <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
                            </svg>
                            <svg className="tema-luna" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
                            </svg>
                        </button>
                    </li>
                    {utente ? (
                        <>
                            <li>
                                {utente.admin
                                    ? <NavLink to="/admin">Admin</NavLink>
                                    : <NavLink to="/profilo">Profilo</NavLink>}
                            </li>
                            <li><button className="btn btn-ghost" onClick={esci}>Esci</button></li>
                        </>
                    ) : (
                        <li><button className="btn btn-primary" onClick={() => apriAccesso()}>Accedi</button></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
