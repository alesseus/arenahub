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
};
