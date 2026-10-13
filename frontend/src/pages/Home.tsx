import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router';
import { getGiochi, getTornei } from '../api';
import TorneoCard from '../components/TorneoCard';
import { dataBreve, fotoValida } from '../formato';
import type { Gioco, Torneo } from '../types';
import './Home.css';

function Home() {
    const [tornei, setTornei] = useState<Torneo[]>([]);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(false);
    const [giochi, setGiochi] = useState<Gioco[]>([]);

    useEffect(() => {
        getTornei('?stato=aperto')
            .then((dati) => setTornei(dati))
            .catch(() => setErrore(true))
            .finally(() => setCaricamento(false));
        getGiochi()
            .then((dati) => setGiochi(dati))
            .catch(() => setGiochi([]));
    }, []);

    const prossimi = tornei.slice(0, 3);

    return (
        <main className="home">
            <Arena tornei={tornei} giochi={giochi} pronto={!caricamento && !errore} />

            {giochi.length > 0 && <StrisciaGiochi giochi={giochi} />}

            <section className="upcoming">
                <div className="upcoming-testa">
                    <h2 className="section-title">Prossimi tornei</h2>
                    <Link to="/tornei" className="btn btn-ghost">Tutti i tornei</Link>
                </div>

                {caricamento ? (
                    <div className="torneo-grid">
                        <div className="torneo-card is-loading" />
                        <div className="torneo-card is-loading" />
                        <div className="torneo-card is-loading" />
                    </div>
                ) : errore ? (
                    <p className="empty-state">Non riesco a caricare i tornei. Riprova tra poco.</p>
                ) : prossimi.length === 0 ? (
                    <p className="empty-state">Nessun torneo aperto</p>
                ) : (
                    <div className="torneo-grid home-grid">
                        {prossimi.map((torneo) => (
                            <TorneoCard key={torneo.id_torneo} torneo={torneo} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function Arena({ tornei, giochi, pronto }: { tornei: Torneo[]; giochi: Gioco[]; pronto: boolean }) {
    const ref = useRef<HTMLElement>(null);
    const frame = useRef(0);

    useEffect(() => {
        const sezione = ref.current;
        if (!sezione) return;
        const osservatore = new IntersectionObserver(([voce]) => {
            sezione.classList.toggle('is-fuori', !voce.isIntersecting);
        });
        osservatore.observe(sezione);
        return () => {
            osservatore.disconnect();
            cancelAnimationFrame(frame.current);
        };
    }, []);

    function muovi(e: PointerEvent<HTMLElement>) {
        if (e.pointerType !== 'mouse') return;
        const sezione = e.currentTarget;
        const box = sezione.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width - 0.5;
        const y = (e.clientY - box.top) / box.height - 0.5;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            sezione.style.setProperty('--mx', x.toFixed(3));
            sezione.style.setProperty('--my', y.toFixed(3));
        });
    }

    return (
        <section className="arena" ref={ref} onPointerMove={muovi} aria-labelledby="arena-titolo">
            <div className="arena-scena" aria-hidden="true">
                <picture>
                    <source media="(max-width: 700px)" srcSet="/img/arena-mobile.jpg" />
                    <img className="arena-foto" src="/img/arena.jpg" alt="" />
                </picture>
                <span className="arena-fascio is-1" />
                <span className="arena-fascio is-2" />
                <span className="arena-fascio is-3" />
                <span className="arena-velo" />
            </div>

            <div className="arena-contenuto">
                <h1 className="arena-titolo" id="arena-titolo">
                    <span className="arena-riga">Entra</span>
                    <span className="arena-riga">
                        nell'<span className="arena-neon">arena</span>
                    </span>
                </h1>
                <p className="arena-testo">Trova un torneo, iscriviti e scala il tabellone fino alla finale.</p>
                <div className="arena-azioni">
                    <Link to="/tornei" className="btn btn-primary arena-cta">Scopri i tornei</Link>
                    <Link to="/classifiche" className="btn arena-secondario">Classifiche</Link>
                </div>
            </div>

            <Ticker tornei={tornei} giochi={giochi} pronto={pronto} />
        </section>
    );
}

function Ticker({ tornei, giochi, pronto }: { tornei: Torneo[]; giochi: Gioco[]; pronto: boolean }) {
    if (!pronto) {
        return <div className="ticker is-vuoto" aria-hidden="true" />;
    }

    const voci = [
        tornei.length === 0 ? 'Nessun torneo aperto' : tornei.length === 1 ? '1 torneo aperto' : `${tornei.length} tornei aperti`,
        ...tornei.map((t) => `${t.nome} · ${t.gioco?.nome ?? 'Gioco'} · ${dataBreve(t.data_ora_inizio)}`),
        ...(giochi.length > 0 ? [`${giochi.length} giochi in arena`] : []),
    ];

    function giro(nascosto: boolean) {
        return (
            <ul className="ticker-giro" aria-hidden={nascosto || undefined}>
                {voci.map((voce, i) => (
                    <li key={i}>{voce}</li>
                ))}
            </ul>
        );
    }

    return (
        <div className="ticker">
            <span className="ticker-etichetta">
                <span className="ticker-punto" />
                In arena
            </span>
            <div className="ticker-binario">
                <div className="ticker-nastro">
                    {giro(false)}
                    {giro(true)}
                </div>
            </div>
        </div>
    );
}

function StrisciaGiochi({ giochi }: { giochi: Gioco[] }) {
    function giro(nascosto: boolean) {
        return (
            <ul className="giochi-giro" aria-hidden={nascosto || undefined}>
                {giochi.map((g) => (
                    <li key={g.id_gioco} className="gioco-tessera">
                        {fotoValida(g.path_foto) ? (
                            <img src={g.path_foto} alt="" loading="lazy" />
                        ) : (
                            <span className="gioco-iniziale">{g.nome.charAt(0)}</span>
                        )}
                        <span className="gioco-nome">{g.nome}</span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section className="giochi" aria-labelledby="giochi-titolo">
            <h2 className="section-title giochi-titolo" id="giochi-titolo">I giochi dell'arena</h2>
            <div className="giochi-binario">
                <div className="giochi-nastro">
                    {giro(false)}
                    {giro(true)}
                </div>
            </div>
        </section>
    );
}

export default Home;
