import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, Plus, Settings2, Users } from '../components/Icone';
import { getImpostazioni, getTornei, salvaImpostazioni } from '../api';
import FormTorneo from '../components/FormTorneo';
import GestioneTorneo from '../components/GestioneTorneo';
import IscrittiTorneo from '../components/IscrittiTorneo';
import Modale from '../components/Modale';
import Tabellone from '../components/Tabellone';
import { dataBreve } from '../formato';
import type { Torneo } from '../types';
import { useUtente } from '../utente-context';
import './Admin.css';

type Vista = 'nuovo' | 'modifica' | 'gestione' | 'iscritti' | 'tabellone';
type Filtro = 'tutti' | Torneo['stato'];

const nomiStato = {
    aperto: 'Aperto',
    chiuso: 'Iscrizioni chiuse',
    concluso: 'Concluso',
};

const filtri: { valore: Filtro; nome: string }[] = [
    { valore: 'tutti', nome: 'Tutti' },
    { valore: 'aperto', nome: 'Aperti' },
    { valore: 'chiuso', nome: 'Chiusi' },
    { valore: 'concluso', nome: 'Conclusi' },
];

const titoli = {
    nuovo: 'Nuovo torneo',
    modifica: 'Modifica torneo',
    gestione: 'Gestione torneo',
    iscritti: 'Iscritti',
    tabellone: 'Tabellone',
};

function Admin() {
    const { utente, apriAccesso } = useUtente();
    const admin = utente?.admin === true;
    const [tornei, setTornei] = useState<Torneo[] | null>(null);
    const [errore, setErrore] = useState(false);
    const [filtro, setFiltro] = useState<Filtro>('tutti');
    const [vista, setVista] = useState<Vista | null>(null);
    const [idScelto, setIdScelto] = useState<number | null>(null);

    function carica() {
        return getTornei()
            .then((lista) => {
                setTornei(lista);
                setErrore(false);
            })
            .catch(() => setErrore(true));
    }

    useEffect(() => {
        if (admin) carica();
    }, [admin]);

    if (!admin) {
        return (
            <main className="admin-page">
                <div className="admin-negato">
                    <h1 className="page-title">Dashboard admin</h1>
                    <p>{utente ? 'Questa pagina è riservata agli admin.' : 'Accedi con un account admin per gestire i tornei.'}</p>
                    {!utente && <button className="btn btn-primary" onClick={() => apriAccesso()}>Accedi</button>}
                </div>
            </main>
        );
    }

    const scelto = tornei?.find((t) => t.id_torneo === idScelto);
    const visibili = tornei?.filter((t) => filtro === 'tutti' || t.stato === filtro) ?? [];

    function apri(nuova: Vista, torneo?: Torneo) {
        setIdScelto(torneo?.id_torneo ?? null);
        setVista(nuova);
    }

    function chiudi() {
        setVista(null);
    }

    function contenutoModale() {
        if (vista === 'nuovo') {
            return <FormTorneo onSalvato={() => { carica(); chiudi(); }} onAnnulla={chiudi} />;
        }
        if (!scelto) return null;
        if (vista === 'modifica') {
            return (
                <FormTorneo
                    key={scelto.id_torneo}
                    torneo={scelto}
                    onSalvato={() => { carica(); setVista('tabellone'); }}
                    onAnnulla={() => setVista('tabellone')}
                />
            );
        }
        if (vista === 'gestione') {
            return (
                <GestioneTorneo
                    key={scelto.id_torneo}
                    torneo={scelto}
                    onModifica={() => setVista('tabellone')}
                    onIscritti={() => setVista('iscritti')}
                    onCambiato={carica}
                />
            );
        }
        if (vista === 'tabellone') {
            return (
                <Tabellone
                    key={scelto.id_torneo}
                    torneo={scelto}
                    onModificaDati={() => setVista('modifica')}
                    onCambiato={carica}
                />
            );
        }
        if (vista === 'iscritti') {
            return <IscrittiTorneo key={scelto.id_torneo} id={scelto.id_torneo} />;
        }
        return null;
    }

    return (
        <main className="admin-page">
            <div className="admin-testa">
                <h1 className="page-title">Dashboard admin</h1>
                <button className="btn btn-primary admin-nuovo" onClick={() => apri('nuovo')}>
                    <Plus aria-hidden="true" />
                    Nuovo torneo
                </button>
            </div>

            <ImpostazioniLimite />

            <div className="admin-filtri" role="group" aria-label="Filtra per stato">
                {filtri.map((f) => {
                    const quanti = tornei?.filter((t) => f.valore === 'tutti' || t.stato === f.valore).length;
                    return (
                        <button
                            key={f.valore}
                            className={filtro === f.valore ? 'admin-filtro is-attivo' : 'admin-filtro'}
                            aria-pressed={filtro === f.valore}
                            onClick={() => setFiltro(f.valore)}
                        >
                            {f.nome}
                            {quanti !== undefined && <span className="admin-conta">{quanti}</span>}
                        </button>
                    );
                })}
            </div>

            {errore && !tornei && <p className="admin-messaggio">Non riesco a caricare i tornei. Riprova tra poco.</p>}

            {!tornei && !errore && (
                <div className="admin-griglia">
                    <div className="admin-card is-loading" />
                    <div className="admin-card is-loading" />
                    <div className="admin-card is-loading" />
                </div>
            )}

            {tornei && visibili.length === 0 && (
                <p className="admin-messaggio">
                    {tornei.length === 0 ? 'Nessun torneo. Crea il primo con "Nuovo torneo".' : 'Nessun torneo in questo stato.'}
                </p>
            )}

            {visibili.length > 0 && (
                <ul className="admin-griglia">
                    {visibili.map((t) => (
                        <li key={t.id_torneo} className={`admin-card is-${t.stato}`}>
                            <div className="admin-card-testa">
                                <p className="admin-card-gioco">{t.gioco?.nome}</p>
                                <span className={`admin-stato is-${t.stato}`}>{nomiStato[t.stato]}</span>
                            </div>
                            <h2 className="admin-card-nome">{t.nome}</h2>
                            <p className="admin-card-data"><CalendarDays aria-hidden="true" /><span>{dataBreve(t.data_ora_inizio)}</span></p>
                            <div className="admin-posti">
                                <div className="admin-posti-testo">
                                    <span>Iscritti</span>
                                    <strong>{t.iscritti}/{t.posti_max}</strong>
                                </div>
                                <div className="admin-barra">
                                    <span style={{ width: `${Math.min(100, (t.iscritti / t.posti_max) * 100)}%` }} />
                                </div>
                                {t.in_attesa > 0 && <p className="admin-attesa">{t.in_attesa} in lista d'attesa</p>}
                            </div>
                            <div className="admin-card-azioni">
                                <button className="btn btn-primary" onClick={() => apri('gestione', t)}><Settings2 aria-hidden="true" />Gestisci</button>
                                <button className="btn btn-ghost" onClick={() => apri('iscritti', t)}><Users aria-hidden="true" />Iscritti</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Modale
                aperta={vista !== null}
                titolo={vista && vista !== 'tabellone' ? titoli[vista] : undefined}
                etichetta={vista ? titoli[vista] : undefined}
                larga={vista === 'nuovo' || vista === 'modifica' || vista === 'iscritti'}
                enorme={vista === 'tabellone'}
                onChiudi={chiudi}
            >
                {contenutoModale()}
            </Modale>
        </main>
    );
}

function ImpostazioniLimite() {
    const [valore, setValore] = useState('');
    const [salvato, setSalvato] = useState<number | null>(null);
    const [caricamento, setCaricamento] = useState(true);
    const [nonDisponibile, setNonDisponibile] = useState(false);
    const [inCorso, setInCorso] = useState(false);
    const [errore, setErrore] = useState('');
    const [fatto, setFatto] = useState(false);

    useEffect(() => {
        getImpostazioni()
            .then((dati) => {
                setValore(String(dati.max_tornei_utente));
                setSalvato(dati.max_tornei_utente);
            })
            .catch(() => setNonDisponibile(true))
            .finally(() => setCaricamento(false));
    }, []);

    async function salva(e: FormEvent) {
        e.preventDefault();
        const numero = Number(valore);
        if (!Number.isInteger(numero) || numero < 1) {
            setErrore('Il limite deve essere un numero intero maggiore di 0');
            setFatto(false);
            return;
        }
        setInCorso(true);
        setErrore('');
        try {
            const dati = await salvaImpostazioni({ max_tornei_utente: numero });
            setSalvato(dati.max_tornei_utente);
            setValore(String(dati.max_tornei_utente));
            setFatto(true);
        } catch (e) {
            setErrore(e instanceof Error ? e.message : 'Qualcosa è andato storto');
        } finally {
            setInCorso(false);
        }
    }

    return (
        <form className="admin-impostazioni" onSubmit={salva} noValidate>
            <div className="admin-impostazioni-testo">
                <h2>Impostazioni</h2>
                <label htmlFor="max-tornei">Tornei attivi per utente</label>
            </div>
            {nonDisponibile ? (
                <p className="admin-impostazioni-info">Impostazioni non disponibili al momento.</p>
            ) : (
                <div className="admin-impostazioni-campo">
                    <input
                        id="max-tornei"
                        type="number"
                        min={1}
                        step={1}
                        inputMode="numeric"
                        value={valore}
                        disabled={caricamento}
                        aria-invalid={errore !== '' || undefined}
                        onChange={(e) => {
                            setValore(e.target.value);
                            setErrore('');
                            setFatto(false);
                        }}
                    />
                    <button
                        className="btn btn-primary"
                        disabled={caricamento || inCorso || Number(valore) === salvato}
                    >
                        Salva
                    </button>
                </div>
            )}
            {errore && <p className="modale-errore admin-impostazioni-msg" role="alert">{errore}</p>}
            {fatto && <p className="admin-impostazioni-info admin-impostazioni-msg" role="status">Limite salvato.</p>}
        </form>
    );
}

export default Admin;
