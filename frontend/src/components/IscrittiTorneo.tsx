import { useEffect, useState } from 'react';
import { getIscritti } from '../api';
import { dataBreve } from '../formato';
import type { Iscritto, IscrittiTorneo as Dati } from '../types';

function Tabella({ righe, attesa = false }: { righe: Iscritto[]; attesa?: boolean }) {
    return (
        <div className="tabella-scorri">
            <table className="tabella">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Data iscrizione</th>
                    </tr>
                </thead>
                <tbody>
                    {righe.map((r, i) => (
                        <tr key={r.email}>
                            <td>{attesa ? r.posizione_attesa : i + 1}</td>
                            <td>{r.nome} {r.cognome}</td>
                            <td>{r.email}</td>
                            <td>{dataBreve(r.data_iscrizione)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function IscrittiTorneo({ id }: { id: number }) {
    const [dati, setDati] = useState<Dati | null>(null);
    const [errore, setErrore] = useState('');

    useEffect(() => {
        getIscritti(id)
            .then(setDati)
            .catch((e) => setErrore(e instanceof Error ? e.message : 'Qualcosa è andato storto'));
    }, [id]);

    if (errore) {
        return <p className="modale-errore" role="alert">{errore}</p>;
    }

    if (!dati) {
        return <div className="tabella-scheletro" />;
    }

    return (
        <div className="iscritti">
            <p className="iscritti-riepilogo">
                <strong>{dati.torneo.nome}</strong>, {dati.iscritti.length} iscritti su {dati.torneo.posti_max}
            </p>

            {dati.iscritti.length === 0 ? (
                <p className="iscritti-vuoto">Ancora nessun iscritto.</p>
            ) : (
                <Tabella righe={dati.iscritti} />
            )}

            {dati.lista_attesa.length > 0 && (
                <>
                    <h3 className="iscritti-titolo">Lista d'attesa</h3>
                    <Tabella righe={dati.lista_attesa} attesa />
                </>
            )}
        </div>
    );
}

export default IscrittiTorneo;
