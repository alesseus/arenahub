import { Link } from 'react-router';
import type { Torneo } from '../types';
import './TorneoCard.css';

type Props = {
    torneo: Torneo;
};

function formattaData(data: string) {
    const d = new Date(data);
    const giorno = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    const ora = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return `${giorno}, ${ora}`;
}

function fotoValida(path: string | null | undefined): path is string {
    return !!path && (path.startsWith('/') || path.startsWith('http'));
}

function TorneoCard({ torneo }: Props) {
    const gioco = torneo.gioco;
    const foto = gioco?.path_foto;
    const completo = torneo.posti_liberi === 0;
    const testoPosti =
        torneo.stato === 'concluso' ? 'Concluso'
        : torneo.stato === 'chiuso' ? 'Iscrizioni chiuse'
        : completo ? 'Completo'
        : `${torneo.posti_liberi} posti liberi`;
    const spento = torneo.stato !== 'aperto' || completo;

    return (
        <article className="torneo-card">
            <div className="torneo-media">
                {fotoValida(foto) ? (
                    <img src={foto} alt="" />
                ) : (
                    <span className="torneo-iniziale">{gioco?.nome.charAt(0) ?? '?'}</span>
                )}
            </div>

            <div className="torneo-body">
                <p className="torneo-gioco">{gioco?.nome ?? 'Gioco'}</p>
                <h4 className="torneo-nome">{torneo.nome}</h4>
                <p className="torneo-data">{formattaData(torneo.data_ora_inizio)}</p>

                <div className="torneo-footer">
                    <p className={spento ? 'torneo-posti is-completo' : 'torneo-posti'}>
                        {testoPosti}
                        <span>{torneo.iscritti}/{torneo.posti_max} iscritti</span>
                    </p>
                    <Link to={`/tornei/${torneo.id_torneo}`} className="btn btn-ghost">Dettaglio</Link>
                </div>
            </div>
        </article>
    );
}

export default TorneoCard;
