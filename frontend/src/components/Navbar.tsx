import { Link, NavLink } from 'react-router';
import { useUtente } from '../utente-context';
import './Navbar.css';

function Navbar() {
    const { utente, apriAccesso, esci } = useUtente();

    return (
        <header className="navbar">
            <Link to="/" className="navbar-logo">ArenaHub</Link>
            <nav>
                <ul className="navbar-links">
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="/tornei">Tornei</NavLink></li>
                    <li><NavLink to="/classifiche">Classifiche</NavLink></li>
                    {utente ? (
                        <>
                            <li className="navbar-destra">
                                {utente.admin
                                    ? <NavLink to="/admin">Admin</NavLink>
                                    : <NavLink to="/profilo">Profilo</NavLink>}
                            </li>
                            <li><button className="btn btn-ghost" onClick={esci}>Esci</button></li>
                        </>
                    ) : (
                        <li className="navbar-destra"><button className="btn btn-primary" onClick={() => apriAccesso()}>Accedi</button></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
