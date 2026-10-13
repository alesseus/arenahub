import { Link, NavLink } from 'react-router';
import './Navbar.css';

function Navbar() {
    return (
        <header className="navbar">
            <Link to="/" className="navbar-logo">ArenaHub</Link>
            <nav>
                <ul className="navbar-links">
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="/tornei">Tornei</NavLink></li>
                    <li><NavLink to="/classifiche">Classifiche</NavLink></li>
                    <li><button className="btn btn-primary">Accedi</button></li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
