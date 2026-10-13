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
                    <p className={completo ? 'torneo-posti is-completo' : 'torneo-posti'}>
                        {completo ? 'Completo' : `${torneo.posti_liberi} posti liberi`}
                        <span>{torneo.iscritti}/{torneo.posti_max} iscritti</span>
                    </p>
                    <a href={`/tornei/${torneo.id_torneo}`} className="btn btn-ghost">Dettaglio</a>
                </div>
            </div>
        </article>
    );
}

export default TorneoCard;
