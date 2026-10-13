import { useEffect, useState, type FormEvent } from 'react';
import { creaTorneo, getGiochi, modificaTorneo } from '../api';
import type { Gioco, Torneo } from '../types';

type Props = {
    torneo?: Torneo;
    onSalvato: () => void;
    onAnnulla: () => void;
};

function perInput(data: string | undefined) {
    return data ? data.slice(0, 16) : '';
}

function FormTorneo({ torneo, onSalvato, onAnnulla }: Props) {
    const [giochi, setGiochi] = useState<Gioco[]>([]);
    const [nome, setNome] = useState(torneo?.nome ?? '');
    const [idGioco, setIdGioco] = useState(torneo?.gioco?.id_gioco.toString() ?? '');
    const [descrizione, setDescrizione] = useState(torneo?.descrizione ?? '');
    const [inizio, setInizio] = useState(perInput(torneo?.data_ora_inizio));
    const [fine, setFine] = useState(perInput(torneo?.data_ora_fine));
    const [posti, setPosti] = useState(torneo?.posti_max.toString() ?? '');
    const [inCorso, setInCorso] = useState(false);
    const [errore, setErrore] = useState('');

    useEffect(() => {
        getGiochi()
            .then(setGiochi)
            .catch(() => setErrore('Non riesco a caricare i giochi. Riprova tra poco.'));
    }, []);

    async function salva(e: FormEvent) {
        e.preventDefault();
        if (fine <= inizio) {
            setErrore('La fine deve essere dopo l\'inizio');
            return;
        }
        const dati = {
            nome: nome.trim(),
            descrizione: descrizione.trim(),
            id_gioco: Number(idGioco),
            data_ora_inizio: `${inizio}:00`,
            data_ora_fine: `${fine}:00`,
            posti_max: Number(posti),
        };
        setInCorso(true);
        setErrore('');
        try {
            if (torneo) {
                await modificaTorneo(torneo.id_torneo, dati);
            } else {
                await creaTorneo(dati);
            }
            onSalvato();
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
                    <input value={nome} onChange={(e) => setNome(e.target.value)} required />
                </label>
                <label className="campo">
                    <span>Gioco</span>
                    <select value={idGioco} onChange={(e) => setIdGioco(e.target.value)} required>
                        <option value="" disabled>Scegli un gioco</option>
                        {giochi.map((g) => (
                            <option key={g.id_gioco} value={g.id_gioco}>{g.nome}</option>
                        ))}
                    </select>
                </label>
            </div>
            <label className="campo">
                <span>Descrizione</span>
                <textarea value={descrizione} onChange={(e) => setDescrizione(e.target.value)} rows={4} />
            </label>
            <div className="accesso-riga">
                <label className="campo">
                    <span>Inizio</span>
                    <input type="datetime-local" value={inizio} onChange={(e) => setInizio(e.target.value)} required />
                </label>
                <label className="campo">
                    <span>Fine</span>
                    <input type="datetime-local" value={fine} onChange={(e) => setFine(e.target.value)} required />
                </label>
            </div>
            <label className="campo campo-corto">
                <span>Posti massimi</span>
                <input type="number" min={1} value={posti} onChange={(e) => setPosti(e.target.value)} required />
            </label>
            <div className="modale-azioni">
                <button type="button" className="btn btn-ghost" onClick={onAnnulla}>Annulla</button>
                <button type="submit" className="btn btn-primary" disabled={inCorso}>
                    {torneo ? 'Salva modifiche' : 'Crea torneo'}
                </button>
            </div>
        </form>
    );
}

export default FormTorneo;
