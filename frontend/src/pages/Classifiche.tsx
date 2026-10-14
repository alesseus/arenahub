import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Trophy } from '../components/Icone';
import { ErroreApi, getClassifica, getTornei } from '../api';
import Modale from '../components/Modale';
import TorneoCard from '../components/TorneoCard';
import type { Classifica, Torneo } from '../types';
import './Classifiche.css';

function Classifiche() {
    const [tornei, setTornei] = useState<Torneo[] | null>(null);
    const [errore, setErrore] = useState(false);
    const [params, setParams] = useSearchParams();
    const id = params.get('classifica');

    useEffect(() => {
        getTornei('?stato=concluso')
            .then((lista) => setTornei([...lista].reverse()))
            .catch(() => setErrore(true));
    }, []);

    function chiudi() {
        const nuovi = new URLSearchParams(params);
        nuovi.delete('classifica');
        setParams(nuovi);
    }

    return (
        <main className="classifiche-page">
            <h1 className="page-title">Classifiche</h1>
            <p className="classifiche-intro">I risultati dei tornei conclusi, dal più recente.</p>

            {errore && <p className="classifiche-messaggio">Non riesco a caricare i tornei. Riprova tra poco.</p>}

            {!tornei && !errore && (
                <div className="torneo-grid">
                    <div className="torneo-card is-loading" />
                    <div className="torneo-card is-loading" />
                    <div className="torneo-card is-loading" />
                </div>
            )}

            {tornei && tornei.length === 0 && (
                <p className="classifiche-messaggio">Nessun torneo concluso, per ora.</p>
            )}

            {tornei && tornei.length > 0 && (
                <div className="torneo-grid">
                    {tornei.map((t) => (
                        <TorneoCard key={t.id_torneo} torneo={t} risultati />
                    ))}
                </div>
            )}

            <Modale aperta={id !== null} larga piena etichetta="Risultati del torneo" onChiudi={chiudi}>
                {id && <Risultati key={id} id={id} />}
            </Modale>
        </main>
    );
}

function Risultati({ id }: { id: string }) {
    const [dati, setDati] = useState<Classifica | null>(null);
    const [errore, setErrore] = useState('');

    useEffect(() => {
        getClassifica(id)
            .then(setDati)
            .catch((e) => {
                if (e instanceof ErroreApi && e.stato === 404) {
                    setErrore('La classifica di questo torneo non è ancora disponibile.');
                } else {
                    setErrore('Non riesco a caricare la classifica. Riprova tra poco.');
                }
            });
    }, [id]);

    if (errore) {
        return (
            <div className="risultati-errore">
                <h2>Risultati</h2>
                <p>{errore}</p>
            </div>
        );
    }

    if (!dati) {
        return <div className="risultati-scheletro" />;
    }

    const [primo] = dati.classifica;
    const nome = (r: Classifica['classifica'][number]) => (r.nome ? `${r.nome} ${r.cognome ?? ''}`.trim() : r.email);

    return (
        <div className="risultati">
            <div className="risultati-trofeo">
                <p className="risultati-gioco">{dati.torneo.gioco?.nome}</p>
                <h2 className="risultati-nome">{dati.torneo.nome}</h2>
                {primo ? (
                    <div className="risultati-vincitore">
                        <p className="risultati-etichetta"><Trophy aria-hidden="true" />Vincitore</p>
                        <p className="risultati-campione">{nome(primo)}</p>
                    </div>
                ) : (
                    <p className="risultati-vuoto">Nessun risultato registrato.</p>
                )}
            </div>

            <ol className="risultati-lista">
                {dati.classifica.map((r) => (
                    <li key={r.email} className={r.posizione <= 3 ? `is-podio is-${r.posizione}` : ''}>
                        <span className="risultati-pos">{r.posizione}</span>
                        <span className="risultati-giocatore">{nome(r)}</span>
                        {r.punteggio !== null && <span className="risultati-punti">{r.punteggio} pt</span>}
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default Classifiche;
