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

export type DatiTorneo = {
    nome: string;
    descrizione: string;
    id_gioco: number;
    data_ora_inizio: string;
    data_ora_fine: string;
    posti_max: number;
};

export type Iscritto = {
    email: string;
    nome: string | null;
    cognome: string | null;
    data_iscrizione: string;
    posizione_attesa?: number;
};

export type IscrittiTorneo = {
    torneo: { id_torneo: number; nome: string; posti_max: number };
    iscritti: Iscritto[];
    lista_attesa: Iscritto[];
};

export type Partecipazione = {
    email: string;
    nome: string | null;
    cognome: string | null;
    punteggio: number | null;
    posizione: number | null;
    qualificato: boolean;
};

export type Partita = {
    id_partita: number;
    id_torneo: number;
    turno: number;
    data_ora: string;
    stato: 'programmata' | 'conclusa';
    partecipazioni?: Partecipazione[];
};
