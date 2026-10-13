import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getTornei } from '../api';
import TorneoCard from '../components/TorneoCard';
import type { Torneo } from '../types';
import './Tornei.css';

type Filtro = 'programma' | 'aperto' | 'concluso' | 'tutti';
type Vista = 'griglia' | 'calendario';

const filtri: { id: Filtro; nome: string }[] = [
    { id: 'programma', nome: 'In programma' },
    { id: 'aperto', nome: 'Iscrizioni aperte' },
    { id: 'concluso', nome: 'Conclusi' },
    { id: 'tutti', nome: 'Tutti' },
];

const nomiStato = {
    aperto: 'Aperto',
    chiuso: 'Chiuso',
    concluso: 'Concluso',
};

function passaFiltro(torneo: Torneo, filtro: Filtro) {
    if (filtro === 'programma') return torneo.stato !== 'concluso';
    if (filtro === 'tutti') return true;
    return torneo.stato === filtro;
}

function raggruppaPerMese(tornei: Torneo[]) {
    const mesi: { mese: string; tornei: Torneo[] }[] = [];
    for (const torneo of tornei) {
        const mese = new Date(torneo.data_ora_inizio).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
        const ultimo = mesi[mesi.length - 1];
        if (ultimo && ultimo.mese === mese) {
            ultimo.tornei.push(torneo);
        } else {
            mesi.push({ mese, tornei: [torneo] });
        }
    }
    return mesi;
}

function Tornei() {
    const [tornei, setTornei] = useState<Torneo[]>([]);
    const [caricamento, setCaricamento] = useState(true);
    const [errore, setErrore] = useState(false);
    const [filtro, setFiltro] = useState<Filtro>('programma');
    const [idGioco, setIdGioco] = useState<number | null>(null);
    const [vista, setVista] = useState<Vista>('griglia');

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
        .filter((torneo) => idGioco === null || torneo.gioco?.id_gioco === idGioco);

    return (
        <main className="tornei-page">
            <header className="tornei-header">
                <h1 className="page-title">Tornei</h1>
                <p className="page-intro">Scegli un torneo, controlla i posti liberi e iscriviti.</p>
            </header>

            <div className="toolbar">
                <div className="chip-group" role="group" aria-label="Stato del torneo">
                    {filtri.map((f) => (
                        <button
                            key={f.id}
                            className="chip"
                            aria-pressed={filtro === f.id}
                            onClick={() => setFiltro(f.id)}
                        >
                            {f.nome}
                        </button>
                    ))}
                </div>

                {giochi.length > 1 && (
                    <div className="chip-group" role="group" aria-label="Gioco">
                        <button className="chip" aria-pressed={idGioco === null} onClick={() => setIdGioco(null)}>
                            Tutti i giochi
                        </button>
                        {giochi.map((gioco) => gioco && (
                            <button
                                key={gioco.id_gioco}
                                className="chip"
                                aria-pressed={idGioco === gioco.id_gioco}
                                onClick={() => setIdGioco(gioco.id_gioco)}
                            >
                                {gioco.nome}
                            </button>
                        ))}
                    </div>
                )}

                <div className="vista-switch" role="group" aria-label="Vista">
                    <button aria-pressed={vista === 'griglia'} onClick={() => setVista('griglia')}>Griglia</button>
                    <button aria-pressed={vista === 'calendario'} onClick={() => setVista('calendario')}>Calendario</button>
                </div>
            </div>

            {caricamento ? (
                <div className="torneo-grid">
                    <div className="torneo-card is-loading" />
                    <div className="torneo-card is-loading" />
                    <div className="torneo-card is-loading" />
                </div>
            ) : errore ? (
                <p className="empty-state">Non riesco a caricare i tornei. Riprova tra poco.</p>
            ) : visibili.length === 0 ? (
                <p className="empty-state">Nessun torneo con questi filtri</p>
            ) : vista === 'griglia' ? (
                <div className="torneo-grid">
                    {visibili.map((torneo) => (
                        <TorneoCard key={torneo.id_torneo} torneo={torneo} />
                    ))}
                </div>
            ) : (
                <div className="calendario">
                    {raggruppaPerMese(visibili).map((gruppo) => (
                        <section key={gruppo.mese} className="cal-mese">
                            <h2 className="cal-mese-titolo">{gruppo.mese}</h2>
                            <ol className="cal-lista">
                                {gruppo.tornei.map((torneo) => {
                                    const data = new Date(torneo.data_ora_inizio);
                                    return (
                                        <li key={torneo.id_torneo} className="cal-riga">
                                            <div className="cal-data">
                                                <span className="cal-giorno">{data.getDate()}</span>
                                                <span className="cal-settimana">
                                                    {data.toLocaleDateString('it-IT', { weekday: 'short' })}
                                                </span>
                                            </div>
                                            <div className="cal-info">
                                                <p className="cal-gioco">{torneo.gioco?.nome}</p>
                                                <h3 className="cal-nome">{torneo.nome}</h3>
                                                <p className="cal-dettagli">
                                                    Ore {data.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}, {torneo.iscritti}/{torneo.posti_max} iscritti
                                                </p>
                                            </div>
                                            <span className={`cal-stato is-${torneo.stato}`}>{nomiStato[torneo.stato]}</span>
                                            <Link to={`/tornei/${torneo.id_torneo}`} className="btn btn-ghost">Dettaglio</Link>
                                        </li>
                                    );
                                })}
                            </ol>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Tornei;
