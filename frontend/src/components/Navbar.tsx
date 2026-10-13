function Navbar() {
    return (
        <header>
            <a href="/">ArenaHub</a>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/tornei">Tornei</a></li>
                    <li><a href="/classifiche">Classifiche</a></li>
                    <li><button>Accedi</button></li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
