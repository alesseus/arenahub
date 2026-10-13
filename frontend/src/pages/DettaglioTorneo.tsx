import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { annullaIscrizione, ErroreApi, getTorneo, iscriviti } from '../api';
import Modale from '../components/Modale';
import { dataBreve, dataLunga, fotoValida } from '../formato';
import type { Torneo } from '../types';
import { useUtente } from '../utente-context';
import './DettaglioTorneo.css';

type TipoModale = 'iscrizione' | 'annullamento' | null;

const nomiStato = {
    aperto: 'Aperto',
    chiuso: 'Chiuso',
    concluso: 'Concluso',
};

function DettaglioTorneo() {
    const { id = '' } = useParams();
    const { utente, apriAccesso } = useUtente();
    const email = utente?.email;
    const [torneo, setTorneo] = useState<Torneo | null>(null);
    const [caricamento, setCaricamento] = useState(true);
    const [nonTrovato, setNonTrovato] = useState(false);
    const [errore, setErrore] = useState(false);
    const [modale, setModale] = useState<TipoModale>(null);
    const [inCorso, setInCorso] = useState(false);
    const [erroreAzione, setErroreAzione] = useState('');

    useEffect(() => {
        getTorneo(id)
            .then((dati) => setTorneo(dati))
            .catch((e) => {
                if (e instanceof ErroreApi && e.stato === 404) {
                    setNonTrovato(true);
                } else {
                    setErrore(true);
                }
            })
            .finally(() => setCaricamento(false));
    }, [id, email]);

    function apriModale(tipo: TipoModale) {
        setErroreAzione('');
        setModale(tipo);
    }

    async function conferma() {
        if (!torneo) return;
        setInCorso(true);
        setErroreAzione('');
        try {
            if (modale === 'iscrizione') {
                await iscriviti(torneo.id_torneo);
            } else {
                await annullaIscrizione(torneo.id_torneo);
            }
            setModale(null);
            setTorneo(await getTorneo(id));
        } catch (e) {
            setErroreAzione(e instanceof Error ? e.message : 'Qualcosa è andato storto');
        } finally {
            setInCorso(false);
        }
    }

    if (caricamento) {
        return (
            <main className="dettaglio">
                <div className="dettaglio-scheletro" />
            </main>
        );
    }

    if (nonTrovato || errore || !torneo) {
        return (
            <main className="dettaglio">
                <Link to="/tornei" className="link-indietro">Tutti i tornei</Link>
                <div className="dettaglio-errore">
                    <h1>{nonTrovato ? 'Torneo non trovato' : 'Non riesco a caricare il torneo'}</h1>
                    <p>{nonTrovato ? 'Il torneo che cerchi non esiste o è stato rimosso.' : 'Riprova tra poco.'}</p>
                    <Link to="/tornei" className="btn btn-primary">Torna ai tornei</Link>
                </div>
            </main>
        );
    }

    const gioco = torneo.gioco;
    const foto = gioco?.path_foto;
    const mio = torneo.mio_stato;
    const pieno = torneo.posti_liberi === 0;

    function riquadroAzione() {
        if (!torneo) return null;

        if (torneo.stato === 'concluso') {
            return (
                <div className="azione is-spenta">
                    <p className="azione-testo">Torneo concluso</p>
                </div>
            );
        }
        if (torneo.stato === 'chiuso') {
            return (
                <div className="azione is-spenta">
                    <p className="azione-testo">
                        {mio?.iscritto ? 'Sei iscritto. Iscrizioni chiuse' : 'Iscrizioni chiuse'}
                    </p>
                </div>
            );
        }
        if (!utente) {
            return (
                <div className="azione">
                    <p className="azione-testo">Accedi per iscriverti a questo torneo</p>
                    <button className="btn btn-primary" onClick={() => apriAccesso()}>Accedi</button>
                </div>
            );
        }
        if (mio?.iscritto) {
            return (
                <div className="azione">
                    <p className="azione-testo is-ok">Sei iscritto</p>
                    <button className="btn btn-ghost" onClick={() => apriModale('annullamento')}>
                        Annulla iscrizione
                    </button>
                </div>
            );
        }
        if (mio?.attesa) {
            return (
                <div className="azione">
                    <p className="badge-attesa">In lista d'attesa, posizione {mio.posizione_attesa}</p>
                    <button className="btn btn-ghost" onClick={() => apriModale('annullamento')}>
                        Esci dalla lista
                    </button>
                </div>
            );
        }
        return (
            <div className="azione">
                <p className="azione-testo">
                    {pieno ? 'Il torneo è al completo' : `${torneo.posti_liberi} posti liberi`}
                </p>
                <button className="btn btn-primary" onClick={() => apriModale('iscrizione')}>
                    {pieno ? "Iscriviti in lista d'attesa" : 'Iscriviti'}
                </button>
            </div>
        );
    }

    return (
        <main className="dettaglio">
            <Link to="/tornei" className="link-indietro">Tutti i tornei</Link>

            <article className="dettaglio-scheda">
                <div className="dettaglio-media">
                    {fotoValida(foto) ? (
                        <img src={foto} alt="" />
                    ) : (
                        <span className="dettaglio-iniziale">{gioco?.nome.charAt(0) ?? '?'}</span>
                    )}
                </div>

                <div className="dettaglio-info">
                    <p className="dettaglio-gioco">{gioco?.nome}</p>
                    <h1 className="dettaglio-nome">{torneo.nome}</h1>

                    <dl className="dettaglio-dati">
                        <div>
                            <dt>Inizio</dt>
                            <dd>{dataLunga(torneo.data_ora_inizio)}</dd>
                        </div>
                        <div>
                            <dt>Fine</dt>
                            <dd>{dataLunga(torneo.data_ora_fine)}</dd>
                        </div>
                        <div>
                            <dt>Posti</dt>
                            <dd>{torneo.iscritti}/{torneo.posti_max}{torneo.in_attesa > 0 && `, ${torneo.in_attesa} in attesa`}</dd>
                        </div>
                        <div>
                            <dt>Stato</dt>
                            <dd><span className={`stato-pill is-${torneo.stato}`}>{nomiStato[torneo.stato]}</span></dd>
                        </div>
                    </dl>
                </div>
            </article>

            {torneo.descrizione && <p className="dettaglio-descrizione">{torneo.descrizione}</p>}

            {riquadroAzione()}

            <Modale
                aperta={modale === 'iscrizione'}
                titolo="Iscrizione"
                onChiudi={() => setModale(null)}
            >
                <div className="modale-torneo">
                    <p className="modale-torneo-nome">{torneo.nome}</p>
                    <p>{gioco?.nome}, {dataBreve(torneo.data_ora_inizio)}</p>
                    <p>Posti liberi: {torneo.posti_liberi} su {torneo.posti_max}</p>
                </div>
                {pieno && (
                    <p className="modale-avviso">
                        Il torneo è al completo. Puoi entrare in lista d'attesa: se si libera un posto, entri tu.
                    </p>
                )}
                {erroreAzione && <p className="modale-errore">{erroreAzione}</p>}
                <div className="modale-azioni">
                    <button className="btn btn-ghost" onClick={() => setModale(null)}>Annulla</button>
                    <button className="btn btn-primary" onClick={conferma} disabled={inCorso}>
                        {pieno ? 'Entra in lista' : 'Iscriviti'}
                    </button>
                </div>
            </Modale>

            <Modale
                aperta={modale === 'annullamento'}
                titolo={mio?.attesa ? "Esci dalla lista d'attesa" : 'Annulla iscrizione'}
                onChiudi={() => setModale(null)}
            >
                <p>
                    {mio?.attesa ? "Vuoi uscire dalla lista d'attesa di " : "Vuoi annullare l'iscrizione a "}
                    <strong>{torneo.nome}</strong>?
                </p>
                {erroreAzione && <p className="modale-errore">{erroreAzione}</p>}
                <div className="modale-azioni">
                    <button className="btn btn-ghost" onClick={() => setModale(null)}>No</button>
                    <button className="btn btn-primary" onClick={conferma} disabled={inCorso}>Sì, annulla</button>
                </div>
            </Modale>
        </main>
    );
}

export default DettaglioTorneo;
