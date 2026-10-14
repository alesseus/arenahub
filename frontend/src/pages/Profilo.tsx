import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Pencil } from '../components/Icone';
import { annullaIscrizione, getMieiTornei, modificaProfilo } from '../api';
import Modale from '../components/Modale';
import { dataBreve } from '../formato';
import type { TorneoMio } from '../types';
import { useUtente } from '../utente-context';
import './Profilo.css';

const nomiStato = {
    aperto: 'Aperto',
    chiuso: 'Iscrizioni chiuse',
    concluso: 'Concluso',
};

function chiaveAttesa(email: string) {
    return `arenahub-attesa-${email}`;
}

function leggiAttesa(email: string): number[] {
    try {
        return JSON.parse(localStorage.getItem(chiaveAttesa(email)) ?? '[]');
    } catch {
        return [];
    }
}

function salvaAttesa(email: string, ids: number[]) {
    try {
        localStorage.setItem(chiaveAttesa(email), JSON.stringify(ids));
    } catch {
        return;
    }
}

function Profilo() {
    const { utente, apriAccesso } = useUtente();
    const [params] = useSearchParams();
    const torneoAperto = params.get('torneo');
    const email = utente?.email;

    const [tornei, setTornei] = useState<TorneoMio[] | null>(null);
    const [errore, setErrore] = useState(false);
    const [promossi, setPromossi] = useState<TorneoMio[]>([]);
    const [daAnnullare, setDaAnnullare] = useState<TorneoMio | null>(null);
    const [personalizza, setPersonalizza] = useState(false);

    function carica(email: string) {
        return getMieiTornei()
            .then((lista) => {
                const primaInAttesa = leggiAttesa(email);
                const nuoviPromossi = lista.filter((t) => !t.attesa && primaInAttesa.includes(t.id_torneo));
                if (nuoviPromossi.length > 0) {
                    setPromossi((vecchi) => [...vecchi, ...nuoviPromossi]);
                }
                salvaAttesa(email, lista.filter((t) => t.attesa).map((t) => t.id_torneo));
                setTornei(lista);
                setErrore(false);
            })
            .catch(() => setErrore(true));
    }

    useEffect(() => {
        if (!email || torneoAperto) return;
        carica(email);
    }, [email, torneoAperto]);

    if (!utente) {
        return (
            <main className="profilo-page">
                <div className="profilo-ospite">
                    <h1 className="page-title">Profilo</h1>
                    <p>Accedi per vedere il tuo profilo e i tornei a cui sei iscritto.</p>
                    <button className="btn btn-primary" onClick={() => apriAccesso()}>Accedi</button>
                </div>
            </main>
        );
    }

    const prossimi = tornei?.filter((t) => t.stato !== 'concluso') ?? [];
    const passati = tornei?.filter((t) => t.stato === 'concluso').reverse() ?? [];
    const iniziali = `${utente.nome.charAt(0)}${utente.cognome.charAt(0)}`;

    function riga(t: TorneoMio) {
        return (
            <li key={t.id_torneo} className={`mio-torneo is-${t.stato}`}>
                <Link to={{ search: `?torneo=${t.id_torneo}` }} className="mio-torneo-link">
                    <span className="mio-torneo-nome">{t.nome}</span>
                    <span className="mio-torneo-info">
                        {dataBreve(t.data_ora_inizio)}
                        <span className={`mio-torneo-stato is-${t.stato}`}>{nomiStato[t.stato]}</span>
                    </span>
                </Link>
                {t.attesa && t.stato !== 'concluso' && (
                    <span className="mio-torneo-attesa">In attesa, posizione {t.posizione_attesa}</span>
                )}
                {t.stato === 'aperto' && (
                    <button className="btn btn-ghost" onClick={() => setDaAnnullare(t)}>
                        {t.attesa ? 'Esci dalla lista' : 'Annulla iscrizione'}
                    </button>
                )}
            </li>
        );
    }

    return (
        <main className="profilo-page">
            <div className="profilo-griglia">
                <aside className="profilo-colonna">
                    <h1 className="page-title">Profilo</h1>
                    <div className="profilo-scheda">
                        <span className="profilo-avatar" aria-hidden="true">{iniziali}</span>
                        <p className="profilo-nome">{utente.nome} {utente.cognome}</p>
                        <p className="profilo-email">{utente.email}</p>
                        <button className="btn btn-primary" onClick={() => setPersonalizza(true)}><Pencil aria-hidden="true" />Personalizza</button>
                    </div>
                </aside>

                <section className="profilo-tornei">
                    <h2 className="page-title">I miei tornei</h2>

                    {promossi.map((t) => (
                        <div key={t.id_torneo} className="avviso-posto" role="status">
                            <p>
                                Si è liberato un posto: ora sei iscritto a <strong>{t.nome}</strong>.
                            </p>
                            <button
                                className="avviso-chiudi"
                                aria-label="Chiudi avviso"
                                onClick={() => setPromossi((vecchi) => vecchi.filter((v) => v.id_torneo !== t.id_torneo))}
                            />
                        </div>
                    ))}

                    {errore && !tornei && (
                        <p className="profilo-messaggio">Non riesco a caricare i tuoi tornei. Riprova tra poco.</p>
                    )}

                    {!tornei && !errore && (
                        <div className="miei-tornei">
                            <div className="mio-torneo is-loading" />
                            <div className="mio-torneo is-loading" />
                            <div className="mio-torneo is-loading" />
                        </div>
                    )}

                    {tornei && prossimi.length === 0 && (
                        <div className="profilo-messaggio">
                            <p>Non sei iscritto a nessun torneo in programma.</p>
                            <Link to="/tornei" className="btn btn-primary">Trova un torneo</Link>
                        </div>
                    )}

                    {prossimi.length > 0 && <ul className="miei-tornei">{prossimi.map(riga)}</ul>}

                    {passati.length > 0 && (
                        <>
                            <h3 className="profilo-sottotitolo">Tornei passati</h3>
                            <ul className="miei-tornei">{passati.map(riga)}</ul>
                        </>
                    )}
                </section>
            </div>

            <ConfermaAnnullamento
                torneo={daAnnullare}
                onChiudi={() => setDaAnnullare(null)}
                onFatto={() => {
                    setDaAnnullare(null);
                    carica(utente.email);
                }}
            />

            <Modale aperta={personalizza} titolo="Personalizza profilo" onChiudi={() => setPersonalizza(false)}>
                {personalizza && <FormProfilo onFatto={() => setPersonalizza(false)} />}
            </Modale>
        </main>
    );
}

function ConfermaAnnullamento({ torneo, onChiudi, onFatto }: { torneo: TorneoMio | null; onChiudi: () => void; onFatto: () => void }) {
    const [inCorso, setInCorso] = useState(false);
    const [errore, setErrore] = useState('');

    function chiudi() {
        setErrore('');
        onChiudi();
    }

    async function conferma() {
        if (!torneo) return;
        setInCorso(true);
        setErrore('');
        try {
            await annullaIscrizione(torneo.id_torneo);
            onFatto();
        } catch (e) {
            setErrore(e instanceof Error ? e.message : 'Qualcosa è andato storto');
        } finally {
            setInCorso(false);
        }
    }

    return (
        <Modale
            aperta={torneo !== null}
            titolo={torneo?.attesa ? "Esci dalla lista d'attesa" : 'Annulla iscrizione'}
            onChiudi={chiudi}
        >
            {torneo && (
                <>
                    <p>
                        {torneo.attesa ? "Vuoi uscire dalla lista d'attesa di " : "Vuoi annullare l'iscrizione a "}
                        <strong>{torneo.nome}</strong>?
                    </p>
                    {errore && <p className="modale-errore" role="alert">{errore}</p>}
                    <div className="modale-azioni">
                        <button className="btn btn-ghost" onClick={chiudi}>No</button>
                        <button className="btn btn-primary" onClick={conferma} disabled={inCorso}>Sì, annulla</button>
                    </div>
                </>
            )}
        </Modale>
    );
}

function FormProfilo({ onFatto }: { onFatto: () => void }) {
    const { utente, accedi } = useUtente();
    const [nome, setNome] = useState(utente?.nome ?? '');
    const [cognome, setCognome] = useState(utente?.cognome ?? '');
    const [inCorso, setInCorso] = useState(false);
    const [errore, setErrore] = useState('');

    async function salva(e: FormEvent) {
        e.preventDefault();
        if (!nome.trim() || !cognome.trim()) {
            setErrore('Nome e cognome non possono essere vuoti');
            return;
        }
        setInCorso(true);
        setErrore('');
        try {
            accedi(await modificaProfilo({ nome: nome.trim(), cognome: cognome.trim() }));
            onFatto();
        } catch (e) {
            setErrore(e instanceof Error ? e.message : 'Qualcosa è andato storto');
        } finally {
            setInCorso(false);
        }
    }

    return (
        <form className="accesso-form" onSubmit={salva}>
            {errore && <p className="modale-errore" role="alert">{errore}</p>}
            <div className="accesso-riga">
                <label className="campo">
                    <span>Nome</span>
                    <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" required />
                </label>
                <label className="campo">
                    <span>Cognome</span>
                    <input value={cognome} onChange={(e) => setCognome(e.target.value)} autoComplete="family-name" required />
                </label>
            </div>
            <label className="campo">
                <span>Email</span>
                <input value={utente?.email ?? ''} disabled />
            </label>
            <div className="modale-azioni">
                <button type="button" className="btn btn-ghost" onClick={onFatto}>Annulla</button>
                <button type="submit" className="btn btn-primary" disabled={inCorso}>Salva</button>
            </div>
        </form>
    );
}

export default Profilo;
