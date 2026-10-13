import { Link } from 'react-router';
import { dataBreve, fotoValida } from '../formato';
import type { Torneo } from '../types';
import './TorneoCard.css';

type Props = {
    torneo: Torneo;
    risultati?: boolean;
};

function TorneoCard({ torneo, risultati = false }: Props) {
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
                <p className="torneo-data">{dataBreve(torneo.data_ora_inizio)}</p>

                <div className="torneo-footer">
                    <p className={spento ? 'torneo-posti is-completo' : 'torneo-posti'}>
                        {testoPosti}
                        <span>{torneo.iscritti}/{torneo.posti_max} iscritti</span>
                    </p>
                    {risultati ? (
                        <Link to={{ search: `?classifica=${torneo.id_torneo}` }} className="btn btn-primary">Risultati</Link>
                    ) : (
                        <Link to={{ search: `?torneo=${torneo.id_torneo}` }} className="btn btn-ghost">Dettaglio</Link>
                    )}
                </div>
            </div>
        </article>
    );
}

export default TorneoCard;
