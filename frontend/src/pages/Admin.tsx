import { useEffect, useState } from 'react';
import { getTornei } from '../api';
import FormTorneo from '../components/FormTorneo';
import GestioneTorneo from '../components/GestioneTorneo';
import IscrittiTorneo from '../components/IscrittiTorneo';
import Modale from '../components/Modale';
import { dataBreve } from '../formato';
import type { Torneo } from '../types';
import { useUtente } from '../utente-context';
import './Admin.css';

type Vista = 'nuovo' | 'modifica' | 'gestione' | 'iscritti';
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
                    onSalvato={() => { carica(); setVista('gestione'); }}
                    onAnnulla={() => setVista('gestione')}
                />
            );
        }
        if (vista === 'gestione') {
            return (
                <GestioneTorneo
                    key={scelto.id_torneo}
                    torneo={scelto}
                    onModifica={() => setVista('modifica')}
                    onIscritti={() => setVista('iscritti')}
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
                    <span aria-hidden="true" className="admin-piu" />
                    Nuovo torneo
                </button>
            </div>

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
                            <p className="admin-card-data">{dataBreve(t.data_ora_inizio)}</p>
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
                                <button className="btn btn-primary" onClick={() => apri('gestione', t)}>Gestisci</button>
                                <button className="btn btn-ghost" onClick={() => apri('iscritti', t)}>Iscritti</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Modale
                aperta={vista !== null}
                titolo={vista ? titoli[vista] : undefined}
                larga={vista === 'nuovo' || vista === 'modifica' || vista === 'iscritti'}
                onChiudi={chiudi}
            >
                {contenutoModale()}
            </Modale>
        </main>
    );
}

export default Admin;
