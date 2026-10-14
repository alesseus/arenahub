import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { ChartNoAxesColumn, House, LayoutDashboard, LogIn, LogOut, Moon, Sun, Trophy, UserRound } from './Icone';
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
                    <li><NavLink to="/" end><House aria-hidden="true" />Home</NavLink></li>
                    <li><NavLink to="/tornei"><Trophy aria-hidden="true" />Tornei</NavLink></li>
                    <li><NavLink to="/classifiche"><ChartNoAxesColumn aria-hidden="true" />Classifiche</NavLink></li>
                    <li className="navbar-destra">
                        <button
                            className={`navbar-tema is-${tema}`}
                            onClick={cambiaTema}
                            aria-label={tema === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
                            title={tema === 'dark' ? 'Tema chiaro' : 'Tema scuro'}
                        >
                            <Sun className="tema-sole" aria-hidden="true" />
                            <Moon className="tema-luna" aria-hidden="true" />
                        </button>
                    </li>
                    {utente ? (
                        <>
                            <li>
                                {utente.admin
                                    ? <NavLink to="/admin"><LayoutDashboard aria-hidden="true" />Admin</NavLink>
                                    : <NavLink to="/profilo"><UserRound aria-hidden="true" />Profilo</NavLink>}
                            </li>
                            <li><button className="btn btn-ghost" onClick={esci}><LogOut aria-hidden="true" />Esci</button></li>
                        </>
                    ) : (
                        <li><button className="btn btn-primary" onClick={() => apriAccesso()}><LogIn aria-hidden="true" />Accedi</button></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
