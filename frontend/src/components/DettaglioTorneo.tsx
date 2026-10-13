import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { annullaIscrizione, ErroreApi, getTorneo, iscriviti } from '../api';
import { dataBreve, dataLunga, fotoValida } from '../formato';
import type { Torneo } from '../types';
import { useUtente } from '../utente-context';
import Modale from './Modale';
import './DettaglioTorneo.css';

type Passo = 'dettaglio' | 'iscrizione' | 'annullamento';

type Risultato = {
    id: string;
    torneo?: Torneo;
    errore?: 'non-trovato' | 'generico';
};

const nomiStato = {
    aperto: 'Aperto',
    chiuso: 'Chiuso',
    concluso: 'Concluso',
};

function DettaglioTorneo() {
    const [params, setParams] = useSearchParams();
    const id = params.get('torneo');

    function chiudi() {
        const nuovi = new URLSearchParams(params);
        nuovi.delete('torneo');
        setParams(nuovi);
    }

    return (
        <Modale aperta={id !== null} larga etichetta="Dettaglio torneo" onChiudi={chiudi}>
            {id && <ContenutoDettaglio key={id} id={id} onChiudi={chiudi} />}
        </Modale>
    );
}

function ContenutoDettaglio({ id, onChiudi }: { id: string; onChiudi: () => void }) {
    const { utente, apriAccesso } = useUtente();
    const email = utente?.email;
    const [risultato, setRisultato] = useState<Risultato | null>(null);
    const [passo, setPasso] = useState<Passo>('dettaglio');
    const [inCorso, setInCorso] = useState(false);
    const [erroreAzione, setErroreAzione] = useState('');

    useEffect(() => {
        getTorneo(id)
            .then((torneo) => setRisultato({ id, torneo }))
            .catch((e) => {
                const nonTrovato = e instanceof ErroreApi && e.stato === 404;
                setRisultato({ id, errore: nonTrovato ? 'non-trovato' : 'generico' });
            });
    }, [id, email]);

    function vaiA(nuovo: Passo) {
        setErroreAzione('');
        setPasso(nuovo);
    }

    async function conferma() {
        const torneo = risultato?.torneo;
        if (!torneo) return;
        setInCorso(true);
        setErroreAzione('');
        try {
            if (passo === 'iscrizione') {
                await iscriviti(torneo.id_torneo);
            } else {
                await annullaIscrizione(torneo.id_torneo);
            }
            setRisultato({ id, torneo: await getTorneo(id) });
            setPasso('dettaglio');
        } catch (e) {
            setErroreAzione(e instanceof Error ? e.message : 'Qualcosa è andato storto');
        } finally {
            setInCorso(false);
        }
    }

    if (!risultato) {
        return <div className="dettaglio-scheletro" />;
    }

    if (!risultato.torneo) {
        return (
            <div className="dettaglio-errore">
                <h2>{risultato.errore === 'non-trovato' ? 'Torneo non trovato' : 'Non riesco a caricare il torneo'}</h2>
                <p>{risultato.errore === 'non-trovato' ? 'Il torneo che cerchi non esiste o è stato rimosso.' : 'Riprova tra poco.'}</p>
                <button className="btn btn-primary" onClick={onChiudi}>Chiudi</button>
            </div>
        );
    }

    const torneo = risultato.torneo;
    const gioco = torneo.gioco;
    const foto = gioco?.path_foto;
    const mio = torneo.mio_stato;
    const pieno = torneo.posti_liberi === 0;

    if (passo === 'iscrizione') {
        return (
            <div className="conferma">
                <h2 className="conferma-titolo">Iscrizione</h2>
                <div className="conferma-torneo">
                    <p className="conferma-nome">{torneo.nome}</p>
                    <p>{gioco?.nome}, {dataBreve(torneo.data_ora_inizio)}</p>
                    <p>Posti liberi: {torneo.posti_liberi} su {torneo.posti_max}</p>
                </div>
                {pieno && (
                    <p className="conferma-avviso">
                        Il torneo è al completo. Puoi entrare in lista d'attesa: se si libera un posto, entri tu.
                    </p>
                )}
                {erroreAzione && <p className="modale-errore">{erroreAzione}</p>}
                <div className="modale-azioni">
                    <button className="btn btn-ghost" onClick={() => vaiA('dettaglio')}>Annulla</button>
                    <button className="btn btn-primary" onClick={conferma} disabled={inCorso}>
                        {pieno ? 'Entra in lista' : 'Iscriviti'}
                    </button>
                </div>
            </div>
        );
    }

    if (passo === 'annullamento') {
        return (
            <div className="conferma">
                <h2 className="conferma-titolo">{mio?.attesa ? "Esci dalla lista d'attesa" : 'Annulla iscrizione'}</h2>
                <p>
                    {mio?.attesa ? "Vuoi uscire dalla lista d'attesa di " : "Vuoi annullare l'iscrizione a "}
                    <strong>{torneo.nome}</strong>?
                </p>
                {erroreAzione && <p className="modale-errore">{erroreAzione}</p>}
                <div className="modale-azioni">
                    <button className="btn btn-ghost" onClick={() => vaiA('dettaglio')}>No</button>
                    <button className="btn btn-primary" onClick={conferma} disabled={inCorso}>Sì, annulla</button>
                </div>
            </div>
        );
    }

    function riquadroAzione() {
        if (torneo.stato === 'concluso') {
            return <div className="azione is-spenta"><p className="azione-testo">Torneo concluso</p></div>;
        }
        if (torneo.stato === 'chiuso') {
            return (
                <div className="azione is-spenta">
                    <p className="azione-testo">{mio?.iscritto ? 'Sei iscritto. Iscrizioni chiuse' : 'Iscrizioni chiuse'}</p>
                </div>
            );
        }
        if (!utente) {
            return (
                <div className="azione">
                    <p className="azione-testo">Accedi per iscriverti</p>
                    <button className="btn btn-primary" onClick={() => apriAccesso()}>Accedi</button>
                </div>
            );
        }
        if (mio?.iscritto) {
            return (
                <div className="azione">
                    <p className="azione-testo is-ok">Sei iscritto</p>
                    <button className="btn btn-ghost" onClick={() => vaiA('annullamento')}>Annulla iscrizione</button>
                </div>
            );
        }
        if (mio?.attesa) {
            return (
                <div className="azione">
                    <p className="badge-attesa">In lista d'attesa, posizione {mio.posizione_attesa}</p>
                    <button className="btn btn-ghost" onClick={() => vaiA('annullamento')}>Esci dalla lista</button>
                </div>
            );
        }
        return (
            <div className="azione">
                <p className="azione-testo">{pieno ? 'Il torneo è al completo' : `${torneo.posti_liberi} posti liberi`}</p>
                <button className="btn btn-primary" onClick={() => vaiA('iscrizione')}>
                    {pieno ? "Iscriviti in lista d'attesa" : 'Iscriviti'}
                </button>
            </div>
        );
    }

    return (
        <article className="dettaglio">
            <div className="dettaglio-media">
                {fotoValida(foto) ? (
                    <img src={foto} alt="" />
                ) : (
                    <span className="dettaglio-iniziale">{gioco?.nome.charAt(0) ?? '?'}</span>
                )}
            </div>

            <div className="dettaglio-corpo">
                <p className="dettaglio-gioco">{gioco?.nome}</p>
                <h2 className="dettaglio-nome">{torneo.nome}</h2>

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

                {torneo.descrizione && <p className="dettaglio-descrizione">{torneo.descrizione}</p>}

                {riquadroAzione()}
            </div>
        </article>
    );
}

export default DettaglioTorneo;
