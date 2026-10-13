import { useEffect, useState, type FormEvent } from 'react';
import { cambiaStato, creaPartita, ErroreApi, getIscritti, getPartite, salvaRisultati } from '../api';
import { dataBreve } from '../formato';
import type { Iscritto, Partecipazione, Partita, Torneo } from '../types';
import './Tabellone.css';

type Props = {
    torneo: Torneo;
    onModificaDati: () => void;
    onCambiato: () => void;
};

type Giocatore = { email: string; nome: string };

function nomeDi(p: { email: string; nome: string | null; cognome: string | null }) {
    return p.nome ? `${p.nome} ${p.cognome ?? ''}`.trim() : p.email;
}

function aCoppie<T>(lista: T[]) {
    const coppie: T[][] = [];
    for (let i = 0; i < lista.length; i += 2) coppie.push(lista.slice(i, i + 2));
    return coppie;
}

function nomeTurno(turno: number, totale: number) {
    const mancanti = totale - turno;
    if (mancanti === 0) return 'Finale';
    if (mancanti === 1) return 'Semifinali';
    if (mancanti === 2) return 'Quarti';
    return `Turno ${turno}`;
}

function vincitoriDi(partite: Partita[]) {
    return partite.flatMap((p) => (p.partecipazioni ?? []).filter((x) => x.qualificato));
}

function Tabellone({ torneo, onModificaDati, onCambiato }: Props) {
    const [partite, setPartite] = useState<Partita[] | null>(null);
    const [iscritti, setIscritti] = useState<Iscritto[] | null>(null);
    const [erroreCarica, setErroreCarica] = useState('');
    const [scelta, setScelta] = useState<number | null>(null);
    const [punteggi, setPunteggi] = useState<Record<string, string>>({});
    const [dataTurno, setDataTurno] = useState('');
    const [confermaFine, setConfermaFine] = useState(false);
    const [inCorso, setInCorso] = useState(false);
    const [errore, setErrore] = useState('');
    const id = torneo.id_torneo;
    const modificabile = torneo.stato === 'chiuso';

    const [versione, setVersione] = useState(0);

    useEffect(() => {
        Promise.all([getPartite(id), getIscritti(id)])
            .then(([p, i]) => {
                setPartite(p);
                setIscritti(i.iscritti);
                setErroreCarica('');
            })
            .catch((e) => {
                if (e instanceof ErroreApi && e.stato === 404) {
                    setErroreCarica('il server non gestisce ancora le partite dei tornei.');
                } else {
                    setErroreCarica(e instanceof Error ? e.message : 'Qualcosa è andato storto');
                }
            });
    }, [id, versione]);

    if (erroreCarica) {
        return (
            <div className="tab-vuoto">
                <p className="modale-errore" role="alert">Non riesco a caricare il tabellone: {erroreCarica}</p>
            </div>
        );
    }

    if (!partite || !iscritti) {
        return <div className="tabella-scheletro" />;
    }

    const ordinate = [...partite].sort((a, b) => a.turno - b.turno || a.id_partita - b.id_partita);
    const ultimo = ordinate.length > 0 ? ordinate[ordinate.length - 1].turno : 0;
    const partiteUltimo = ordinate.filter((p) => p.turno === ultimo);
    const turnoFinito = partiteUltimo.length > 0 && partiteUltimo.every((p) => p.stato === 'conclusa');
    const vincitori = vincitoriDi(partiteUltimo);
    const campione = turnoFinito && vincitori.length === 1 ? vincitori[0] : null;
    const totaleTurni = Math.max(Math.ceil(Math.log2(Math.max(iscritti.length, 2))), ultimo);
    const partitaScelta = ordinate.find((p) => p.id_partita === scelta);

    const prossimi: Giocatore[] =
        ultimo === 0
            ? iscritti.map((i) => ({ email: i.email, nome: nomeDi(i) }))
            : turnoFinito && !campione
              ? vincitori.map((v) => ({ email: v.email, nome: nomeDi(v) }))
              : [];

    const colonne: { turno: number; partite: Partita[]; anteprima?: Giocatore[][]; vuote?: number }[] = [];
    let giocatoriTurno = iscritti.length;
    for (let t = 1; t <= totaleTurni; t++) {
        const reali = ordinate.filter((p) => p.turno === t);
        const quante = Math.ceil(giocatoriTurno / 2);
        if (reali.length > 0) {
            colonne.push({ turno: t, partite: reali });
        } else if (t === ultimo + 1 && prossimi.length > 1) {
            colonne.push({ turno: t, partite: [], anteprima: aCoppie(prossimi) });
        } else {
            colonne.push({ turno: t, partite: [], vuote: quante });
        }
        giocatoriTurno = reali.length > 0 ? reali.length : quante;
    }

    function scegli(p: Partita) {
        if (!modificabile || p.stato === 'conclusa' || (p.partecipazioni ?? []).length < 2) return;
        setScelta(p.id_partita);
        setPunteggi({});
        setErrore('');
    }

    async function esegui(azione: () => Promise<unknown>) {
        setInCorso(true);
        setErrore('');
        try {
            await azione();
        } catch (e) {
            setErrore(e instanceof Error ? e.message : 'Qualcosa è andato storto');
        } finally {
            setVersione((v) => v + 1);
            setInCorso(false);
        }
    }

    function salvaRisultato(e: FormEvent) {
        e.preventDefault();
        const giocatori = partitaScelta?.partecipazioni ?? [];
        if (!partitaScelta || giocatori.length < 2) return;
        const [a, b] = giocatori;
        const pa = Number(punteggi[a.email]);
        const pb = Number(punteggi[b.email]);
        if (pa === pb) {
            setErrore('Pareggio: serve un vincitore per passare il turno');
            return;
        }
        const vinceA = pa > pb;
        esegui(async () => {
            await salvaRisultati(partitaScelta.id_partita, [
                { email: a.email, punteggio: pa, posizione: vinceA ? 1 : 2, qualificato: vinceA },
                { email: b.email, punteggio: pb, posizione: vinceA ? 2 : 1, qualificato: !vinceA },
            ]);
            setScelta(null);
        });
    }

    function avviaTurno(e: FormEvent) {
        e.preventDefault();
        const turno = ultimo + 1;
        esegui(async () => {
            for (const coppia of aCoppie(prossimi)) {
                const partita = await creaPartita(id, {
                    turno,
                    data_ora: `${dataTurno}:00`,
                    partecipazioni: coppia.map((g) => ({ email: g.email })),
                });
                if (coppia.length === 1) {
                    await salvaRisultati(partita.id_partita, [
                        { email: coppia[0].email, punteggio: null, posizione: 1, qualificato: true },
                    ]);
                }
            }
            setDataTurno('');
        });
    }

    function concludi() {
        esegui(async () => {
            await cambiaStato(id, 'concluso');
            setConfermaFine(false);
            onCambiato();
        });
    }

    function riga(x: Partecipazione | Giocatore | undefined, partita?: Partita) {
        if (!x) {
            return (
                <div className="tab-giocatore is-vuoto">
                    <span>{partita?.stato === 'conclusa' ? 'Nessun avversario' : 'Da definire'}</span>
                </div>
            );
        }
        const dati = 'qualificato' in x ? x : null;
        const classi = ['tab-giocatore'];
        if (dati?.qualificato && partita?.stato === 'conclusa') classi.push('is-vincitore');
        if (dati && !dati.qualificato && partita?.stato === 'conclusa') classi.push('is-perdente');
        return (
            <div className={classi.join(' ')}>
                <span className="tab-nome">{dati ? nomeDi(dati) : x.nome}</span>
                {dati?.punteggio !== null && dati?.punteggio !== undefined && (
                    <span className="tab-punti">{dati.punteggio}</span>
                )}
            </div>
        );
    }

    function azione() {
        if (torneo.stato === 'aperto') {
            return <p className="tab-nota">Chiudi le iscrizioni per creare il tabellone.</p>;
        }
        if (iscritti!.length < 2 && ultimo === 0) {
            return <p className="tab-nota">Servono almeno 2 iscritti per creare il tabellone.</p>;
        }
        if (campione) {
            return (
                <div className="tab-campione">
                    <p className="tab-campione-etichetta">Vincitore</p>
                    <p className="tab-campione-nome">{nomeDi(campione)}</p>
                    {torneo.stato === 'chiuso' && !confermaFine && (
                        <button className="btn btn-primary" onClick={() => setConfermaFine(true)}>Concludi torneo</button>
                    )}
                    {confermaFine && (
                        <div className="gestione-conferma">
                            <p className="gestione-domanda">Concludere il torneo?</p>
                            <p>Il torneo passa tra quelli conclusi e il tabellone non si potrà più modificare.</p>
                            <div className="modale-azioni">
                                <button className="btn btn-ghost" onClick={() => setConfermaFine(false)}>No</button>
                                <button className="btn btn-primary" onClick={concludi} disabled={inCorso}>Sì, concludi</button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        if (!modificabile) return null;
        if (partitaScelta) {
            const giocatori = partitaScelta.partecipazioni ?? [];
            return (
                <form className="tab-pannello" onSubmit={salvaRisultato}>
                    <p className="tab-pannello-titolo">
                        Risultato, {nomeTurno(partitaScelta.turno, totaleTurni).toLowerCase()}
                    </p>
                    <div className="tab-punteggi">
                        {giocatori.map((g, i) => (
                            <label key={g.email} className="campo">
                                <span>{nomeDi(g)}</span>
                                <input
                                    type="number"
                                    min={0}
                                    required
                                    autoFocus={i === 0}
                                    value={punteggi[g.email] ?? ''}
                                    onChange={(e) => setPunteggi({ ...punteggi, [g.email]: e.target.value })}
                                />
                            </label>
                        ))}
                    </div>
                    <div className="modale-azioni">
                        <button type="button" className="btn btn-ghost" onClick={() => setScelta(null)}>Annulla</button>
                        <button type="submit" className="btn btn-primary" disabled={inCorso}>Salva risultato</button>
                    </div>
                </form>
            );
        }
        if (prossimi.length > 1) {
            return (
                <form className="tab-pannello" onSubmit={avviaTurno}>
                    <p className="tab-pannello-titolo">
                        {ultimo === 0 ? 'Crea il primo turno' : `Avvia ${nomeTurno(ultimo + 1, totaleTurni).toLowerCase()}`}
                    </p>
                    <p className="tab-nota">
                        {aCoppie(prossimi).length} partite come nell'anteprima del tabellone.
                        {prossimi.length % 2 === 1 && " L'ultimo giocatore passa il turno."}
                    </p>
                    <div className="tab-riga-form">
                        <label className="campo">
                            <span>Data e ora delle partite</span>
                            <input type="datetime-local" required value={dataTurno} onChange={(e) => setDataTurno(e.target.value)} />
                        </label>
                        <button type="submit" className="btn btn-primary" disabled={inCorso}>
                            {ultimo === 0 ? 'Crea turno' : 'Avvia turno'}
                        </button>
                    </div>
                </form>
            );
        }
        return <p className="tab-nota">Clicca una partita per inserire il risultato.</p>;
    }

    return (
        <div className="tab">
            <div className="tab-testa">
                <p className="tab-torneo">
                    <strong>{torneo.nome}</strong>, {iscritti.length} giocatori
                </p>
                {torneo.stato !== 'concluso' && (
                    <button className="btn btn-ghost" onClick={onModificaDati}>Modifica dati torneo</button>
                )}
            </div>

            <div className="tab-scorri">
                <div className="tab-colonne" style={{ gridTemplateColumns: `repeat(${colonne.length}, minmax(200px, 1fr))` }}>
                    {colonne.map((c) => (
                        <section key={c.turno} className="tab-colonna" aria-label={nomeTurno(c.turno, totaleTurni)}>
                            <h3 className="tab-turno">{nomeTurno(c.turno, totaleTurni)}</h3>
                            <div className="tab-partite">
                                {c.partite.map((p) => {
                                    const giocatori = p.partecipazioni ?? [];
                                    const cliccabile = modificabile && p.stato !== 'conclusa' && giocatori.length > 1;
                                    const classi = ['tab-partita', `is-${p.stato}`];
                                    if (p.id_partita === scelta) classi.push('is-scelta');
                                    const contenuto = (
                                        <>
                                            {riga(giocatori[0], p)}
                                            {riga(giocatori[1], p)}
                                            <span className="tab-data">{dataBreve(p.data_ora)}</span>
                                        </>
                                    );
                                    return cliccabile ? (
                                        <button key={p.id_partita} className={classi.join(' ')} onClick={() => scegli(p)}>
                                            {contenuto}
                                        </button>
                                    ) : (
                                        <div key={p.id_partita} className={classi.join(' ')}>{contenuto}</div>
                                    );
                                })}
                                {c.anteprima?.map((coppia, i) => (
                                    <div key={i} className="tab-partita is-anteprima">
                                        {riga(coppia[0])}
                                        {coppia[1] ? riga(coppia[1]) : (
                                            <div className="tab-giocatore is-vuoto"><span>Nessun avversario</span></div>
                                        )}
                                    </div>
                                ))}
                                {Array.from({ length: c.vuote ?? 0 }, (_, i) => (
                                    <div key={i} className="tab-partita is-futura">
                                        {riga(undefined)}
                                        {riga(undefined)}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {errore && <p className="modale-errore" role="alert">{errore}</p>}
            {azione()}
        </div>
    );
}

export default Tabellone;
