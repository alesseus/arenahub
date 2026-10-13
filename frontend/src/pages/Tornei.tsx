import { useEffect, useState } from 'react';
import { getTornei } from '../api';
import CalendarioTornei from '../components/CalendarioTornei';
import TorneoCard from '../components/TorneoCard';
import type { Torneo } from '../types';
import './Tornei.css';

type Filtro = 'programma' | 'aperto' | 'concluso' | 'tutti';

function passaFiltro(torneo: Torneo, filtro: Filtro) {
    if (filtro === 'programma') return torneo.stato !== 'concluso';
    if (filtro === 'tutti') return true;
    return torneo.stato === filtro;
}

function Tornei() {
    const [tornei, setTornei] = useState<Torneo[]>([]);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(false);
    const [filtro, setFiltro] = useState<Filtro>('programma');
    const [idGioco, setIdGioco] = useState('');

    useEffect(() => {
        getTornei()
            .then((dati) => setTornei(dati))
            .catch(() => setErrore(true))
            .finally(() => setCaricamento(false));
    }, []);

    const giochi = tornei
        .map((torneo) => torneo.gioco)
        .filter((gioco, i, lista) => gioco && lista.findIndex((g) => g?.id_gioco === gioco.id_gioco) === i);

    const visibili = tornei
        .filter((torneo) => passaFiltro(torneo, filtro))
        .filter((torneo) => idGioco === '' || String(torneo.gioco?.id_gioco) === idGioco);

    return (
        <main className="tornei-page">
            <h1 className="page-title">Tornei</h1>

            {caricamento ? (
                <div className="calendario-scheletro" />
            ) : errore ? (
                <p className="empty-state">Non riesco a caricare i tornei. Riprova tra poco.</p>
            ) : (
                <CalendarioTornei tornei={tornei} />
            )}

            <section className="lista-tornei">
                <div className="lista-testa">
                    <h2 className="section-title">Tutti i tornei</h2>

                    <div className="filtri">
                        <label className="filtro">
                            <span>Stato</span>
                            <select value={filtro} onChange={(e) => setFiltro(e.target.value as Filtro)}>
                                <option value="programma">In programma</option>
                                <option value="aperto">Iscrizioni aperte</option>
                                <option value="concluso">Conclusi</option>
                                <option value="tutti">Tutti</option>
                            </select>
                        </label>

                        <label className="filtro">
                            <span>Gioco</span>
                            <select value={idGioco} onChange={(e) => setIdGioco(e.target.value)}>
                                <option value="">Tutti i giochi</option>
                                {giochi.map((gioco) => gioco && (
                                    <option key={gioco.id_gioco} value={gioco.id_gioco}>{gioco.nome}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                {caricamento ? (
                    <div className="torneo-grid">
                        <div className="torneo-card is-loading" />
                        <div className="torneo-card is-loading" />
                        <div className="torneo-card is-loading" />
                    </div>
                ) : !errore && visibili.length === 0 ? (
                    <p className="empty-state">Nessun torneo con questi filtri</p>
                ) : (
                    <div className="torneo-grid">
                        {visibili.map((torneo) => (
                            <TorneoCard key={torneo.id_torneo} torneo={torneo} />
                        ))}
                    </div>
                )}

                <p className="nota-accesso">Registrati o accedi per iscriverti a un torneo.</p>
            </section>
        </main>
    );
}

export default Tornei;
