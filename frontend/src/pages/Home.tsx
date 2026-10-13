import { useEffect, useState } from 'react';
import TorneoCard from '../components/TorneoCard';
import type { Torneo } from '../types';
import './Home.css';

function Home() {
    const [tornei, setTornei] = useState<Torneo[]>([]);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/tornei?stato=aperto&limit=3`)
            .then((risposta) => {
                if (!risposta.ok) {
                    throw new Error('Risposta non valida');
                }
                return risposta.json();
            })
            .then((dati: Torneo[]) => setTornei(dati))
            .catch(() => setErrore(true))
            .finally(() => setCaricamento(false));
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

                {caricamento ? (
                    <div className="torneo-grid">
                        <div className="torneo-card is-loading" />
                        <div className="torneo-card is-loading" />
                        <div className="torneo-card is-loading" />
                    </div>
                ) : errore ? (
                    <p className="empty-state">Non riesco a caricare i tornei. Riprova tra poco.</p>
                ) : tornei.length === 0 ? (
                    <p className="empty-state">Nessun torneo aperto</p>
                ) : (
                    <div className="torneo-grid">
                        {tornei.map((torneo) => (
                            <TorneoCard key={torneo.id_torneo} torneo={torneo} />
                        ))}
                    </div>
                )}
            </section>

            <a href="/tornei" className="btn btn-primary home-cta">Visualizza tornei</a>
        </main>
    );
}

export default Home;
