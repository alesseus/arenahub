export type Gioco = {
    id_gioco: number;
    nome: string;
    path_foto: string | null;
};

export type Torneo = {
    id_torneo: number;
    nome: string;
    descrizione: string | null;
    gioco: Gioco | null;
    data_ora_inizio: string;
    data_ora_fine: string;
    posti_max: number;
    stato: 'aperto' | 'chiuso' | 'concluso';
    iscritti: number;
    posti_liberi: number;
    in_attesa: number;
    mio_stato?: MioStato;
};

export type MioStato = {
    iscritto: boolean;
    attesa: boolean;
    posizione_attesa: number | null;
};

export type Iscrizione = {
    id_torneo: number;
    email: string;
    data_iscrizione: string;
    attesa: boolean;
    posizione_attesa: number | null;
};

export type TorneoMio = {
    id_torneo: number;
    nome: string;
    data_ora_inizio: string;
    stato: 'aperto' | 'chiuso' | 'concluso';
    data_iscrizione: string;
    attesa: boolean;
    posizione_attesa: number | null;
};
