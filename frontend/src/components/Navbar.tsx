import './Navbar.css';

function Navbar() {
    return (
        <header className="navbar">
            <a href="/" className="navbar-logo">ArenaHub</a>
            <nav>
                <ul className="navbar-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/tornei">Tornei</a></li>
                    <li><a href="/classifiche">Classifiche</a></li>
                    <li><button className="btn btn-primary">Accedi</button></li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
