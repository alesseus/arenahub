import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from '../components/Icone';
import { getGiochi, getTornei } from '../api';
import TorneoCard from '../components/TorneoCard';
import { fotoValida } from '../formato';
import type { Gioco, Torneo } from '../types';
import { caricaYouTube, type PlayerYouTube } from '../youtube';
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
            <Arena />

            {giochi.length > 0 && <StrisciaGiochi giochi={giochi} />}

            <section className="upcoming">
                <div className="upcoming-testa">
                    <h2 className="section-title">Prossimi tornei</h2>
                    <Link to="/tornei" className="btn btn-ghost">Tutti i tornei<ArrowRight aria-hidden="true" /></Link>
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

const VIDEO_ID = 'QlG4tsOc28M';
const VIDEO_INIZIO = 22;
const VIDEO_FINE = 62;

function Arena() {
    const ref = useRef<HTMLElement>(null);
    const video = useRef<HTMLDivElement>(null);
    const frame = useRef(0);

    useEffect(() => {
        const sezione = ref.current;
        if (!sezione) return;
        const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let player: PlayerYouTube | null = null;
        let pronto = false;
        let visibile = true;
        let annullato = false;

        if (!ridotto) {
            caricaYouTube().then((yt) => {
                if (annullato || !video.current) return;
                player = new yt.Player(video.current, {
                    host: 'https://www.youtube-nocookie.com',
                    videoId: VIDEO_ID,
                    playerVars: {
                        autoplay: 1,
                        mute: 1,
                        controls: 0,
                        start: VIDEO_INIZIO,
                        end: VIDEO_FINE,
                        playsinline: 1,
                        rel: 0,
                        iv_load_policy: 3,
                        cc_load_policy: 0,
                        disablekb: 1,
                        fs: 0,
                    },
                    events: {
                        onReady: (e) => {
                            pronto = true;
                            e.target.mute();
                            if (visibile) e.target.playVideo();
                        },
                        onStateChange: (e) => {
                            if (e.data === yt.PlayerState.PLAYING) sezione.classList.add('is-video');
                            if (e.data === yt.PlayerState.ENDED) {
                                e.target.seekTo(VIDEO_INIZIO, true);
                                e.target.playVideo();
                            }
                        },
                    },
                });
            });
        }

        const osservatore = new IntersectionObserver(([voce]) => {
            visibile = voce.isIntersecting;
            sezione.classList.toggle('is-fuori', !visibile);
            if (!player || !pronto) return;
            if (visibile) player.playVideo();
            else player.pauseVideo();
        });
        osservatore.observe(sezione);
        return () => {
            annullato = true;
            osservatore.disconnect();
            cancelAnimationFrame(frame.current);
            player?.destroy();
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
                <div className="arena-video">
                    <div ref={video} />
                </div>
                <span className="arena-colore" />
                <span className="arena-velo" />
                <span className="arena-griglia" />
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
                    <Link to="/tornei" className="btn btn-primary arena-cta">Scopri i tornei<ArrowRight aria-hidden="true" /></Link>
                    <Link to="/classifiche" className="btn arena-secondario">Classifiche</Link>
                </div>
            </div>

        </section>
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
