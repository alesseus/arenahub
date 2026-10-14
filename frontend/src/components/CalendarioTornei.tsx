import { useState } from 'react';
import { Link } from 'react-router';
import type { Torneo } from '../types';
import './CalendarioTornei.css';

type Props = {
    tornei: Torneo[];
};

const giorniSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

const nomiStato = {
    aperto: 'Aperto',
    chiuso: 'Chiuso',
    concluso: 'Concluso',
};

function primoMeseUtile(tornei: Torneo[]) {
    const oggi = new Date();
    const prossimo = tornei.find((t) => new Date(t.data_ora_inizio) >= oggi);
    const base = prossimo ? new Date(prossimo.data_ora_inizio) : oggi;
    return new Date(base.getFullYear(), base.getMonth(), 1);
}

function stessoGiorno(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function CalendarioTornei({ tornei }: Props) {
    const [mese, setMese] = useState(() => primoMeseUtile(tornei));

    const anno = mese.getFullYear();
    const numeroMese = mese.getMonth();
    const giorniNelMese = new Date(anno, numeroMese + 1, 0).getDate();
    const vuotiIniziali = (new Date(anno, numeroMese, 1).getDay() + 6) % 7;
    const oggi = new Date();

    const caselle: (Date | null)[] = [];
    for (let i = 0; i < vuotiIniziali; i++) caselle.push(null);
    for (let g = 1; g <= giorniNelMese; g++) caselle.push(new Date(anno, numeroMese, g));

    const torneiDelMese = tornei
        .filter((t) => {
            const d = new Date(t.data_ora_inizio);
            return d.getFullYear() === anno && d.getMonth() === numeroMese;
        })
        .sort((a, b) => new Date(a.data_ora_inizio).getTime() - new Date(b.data_ora_inizio).getTime());

    const titolo = mese.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    const nomeMese = mese.toLocaleDateString('it-IT', { month: 'long' });

    return (
        <section className="calendario" aria-label="Calendario tornei">
            <div className="cal-mese">
                <div className="cal-testa">
                    <h2 className="cal-titolo">{titolo}</h2>
                    <div className="cal-frecce">
                        <button
                            className="cal-freccia is-prev"
                            aria-label="Mese precedente"
                            onClick={() => setMese(new Date(anno, numeroMese - 1, 1))}
                        />
                        <button
                            className="cal-freccia is-next"
                            aria-label="Mese successivo"
                            onClick={() => setMese(new Date(anno, numeroMese + 1, 1))}
                        />
                    </div>
                </div>

                <div className="cal-griglia">
                    {giorniSettimana.map((g) => (
                        <div key={g} className="cal-nome-giorno">{g}</div>
                    ))}

                    {caselle.map((giorno, i) => {
                        if (!giorno) {
                            return <div key={`vuoto-${i}`} className="cal-casella is-vuota" />;
                        }
                        const eventi = torneiDelMese.filter((t) => stessoGiorno(new Date(t.data_ora_inizio), giorno));
                        const classi = ['cal-casella'];
                        if (stessoGiorno(giorno, oggi)) classi.push('is-oggi');
                        if (eventi.length > 0) classi.push('has-eventi');

                        return (
                            <div key={giorno.getDate()} className={classi.join(' ')}>
                                <span className="cal-numero">{giorno.getDate()}</span>
                                {eventi.length > 0 && (
                                    <span className="cal-punti" aria-hidden="true">
                                        {eventi.slice(0, 3).map((t) => (
                                            <span key={t.id_torneo} className={`cal-punto is-${t.stato}`} />
                                        ))}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="cal-lato">
                <h3 className="cal-lato-titolo">
                    Tornei di {nomeMese}
                    <span className="cal-conta">{torneiDelMese.length}</span>
                </h3>

                {torneiDelMese.length === 0 ? (
                    <p className="cal-nessuno">Nessun torneo in questo mese</p>
                ) : (
                    <div className="cal-scorri">
                        <ol className="cal-agenda">
                            {torneiDelMese.map((t) => {
                                const d = new Date(t.data_ora_inizio);
                                const ora = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <li key={t.id_torneo}>
                                        <Link to={{ search: `?torneo=${t.id_torneo}` }} className={`cal-voce is-${t.stato}`}>
                                            <span className="cal-voce-data">
                                                <strong>{d.getDate()}</strong>
                                                {d.toLocaleDateString('it-IT', { weekday: 'short' })}
                                            </span>
                                            <span className="cal-voce-testo">
                                                <span className="cal-voce-nome">{t.nome}</span>
                                                <span className="cal-voce-info">{t.gioco?.nome ?? 'Gioco'}, ore {ora}</span>
                                            </span>
                                            <span className="cal-voce-stato">{nomiStato[t.stato]}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CalendarioTornei;
