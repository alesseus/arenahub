import { useState } from 'react';
import { cambiaStato } from '../api';
import { dataLunga } from '../formato';
import type { Torneo } from '../types';

type Props = {
    torneo: Torneo;
    onModifica: () => void;
    onIscritti: () => void;
    onCambiato: () => void;
};

const passi = [
    { stato: 'aperto', nome: 'Aperto' },
    { stato: 'chiuso', nome: 'Iscrizioni chiuse' },
    { stato: 'concluso', nome: 'Concluso' },
];

const conferme = {
    chiuso: {
        domanda: 'Chiudere le iscrizioni?',
        testo: 'Nessuno potrà più iscriversi o annullare. Non si torna indietro.',
        bottone: 'Sì, chiudi',
    },
    concluso: {
        domanda: 'Concludere il torneo?',
        testo: 'Il torneo passa tra quelli conclusi. Non si torna indietro.',
        bottone: 'Sì, concludi',
    },
};

function GestioneTorneo({ torneo, onModifica, onIscritti, onCambiato }: Props) {
    const [daConfermare, setDaConfermare] = useState<'chiuso' | 'concluso' | null>(null);
    const [inCorso, setInCorso] = useState(false);
    const [errore, setErrore] = useState('');
    const indice = passi.findIndex((p) => p.stato === torneo.stato);

    async function conferma() {
        if (!daConfermare) return;
        setInCorso(true);
        setErrore('');
        try {
            await cambiaStato(torneo.id_torneo, daConfermare);
            setDaConfermare(null);
            onCambiato();
        } catch (e) {
            setErrore(e instanceof Error ? e.message : 'Qualcosa è andato storto');
        } finally {
            setInCorso(false);
        }
    }

    return (
        <div className="gestione">
            <div className="gestione-dati">
                <p className="gestione-gioco">{torneo.gioco?.nome}</p>
                <p className="gestione-nome">{torneo.nome}</p>
                <p>{dataLunga(torneo.data_ora_inizio)}</p>
                <p>
                    {torneo.iscritti}/{torneo.posti_max} iscritti
                    {torneo.in_attesa > 0 && `, ${torneo.in_attesa} in attesa`}
                </p>
            </div>

            <ol className="stati" aria-label="Stato del torneo">
                {passi.map((p, i) => (
                    <li
                        key={p.stato}
                        className={i < indice ? 'is-fatto' : i === indice ? 'is-attuale' : ''}
                        aria-current={i === indice ? 'step' : undefined}
                    >
                        {p.nome}
                    </li>
                ))}
            </ol>

            {errore && <p className="modale-errore" role="alert">{errore}</p>}

            {daConfermare ? (
                <div className="gestione-conferma">
                    <p className="gestione-domanda">{conferme[daConfermare].domanda}</p>
                    <p>{conferme[daConfermare].testo}</p>
                    <div className="modale-azioni">
                        <button className="btn btn-ghost" onClick={() => setDaConfermare(null)}>No</button>
                        <button className="btn btn-primary" onClick={conferma} disabled={inCorso}>
                            {conferme[daConfermare].bottone}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="modale-azioni gestione-azioni">
                    <button className="btn btn-ghost" onClick={onIscritti}>Iscritti</button>
                    {torneo.stato !== 'concluso' && (
                        <button className="btn btn-ghost" onClick={onModifica}>Modifica</button>
                    )}
                    {torneo.stato === 'aperto' && (
                        <button className="btn btn-primary" onClick={() => setDaConfermare('chiuso')}>Chiudi iscrizioni</button>
                    )}
                    {torneo.stato === 'chiuso' && (
                        <button className="btn btn-primary" onClick={() => setDaConfermare('concluso')}>Concludi</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default GestioneTorneo;
