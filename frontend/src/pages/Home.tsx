import { useEffect } from 'react';
import './Home.css';

function Home() {
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/tornei?stato=aperto&limit=3`)
            .then((risposta) => risposta.json())
            .then((dati) => console.log(dati));
    }, []);

    return (
        <main className="home">
            <h1 className="sr-only">HOME</h1>

            <section className="hero">
                <h2 className="hero-title">Benvenuto su ArenaHub</h2>
                <p className="hero-text">Trova un torneo, iscriviti e segui la classifica.</p>
            </section>

            <section className="upcoming">
                <h3 className="section-title">Prossimi tornei</h3>
                <p className="empty-state">Nessun torneo aperto</p>
            </section>

            <a href="/tornei" className="btn btn-primary home-cta">Visualizza tornei</a>
        </main>
    );
}

export default Home;
