import { createContext, useContext } from 'react';
import type { Utente } from './sessione';

export type ModoAccesso = 'login' | 'registrazione';

export type ContestoUtente = {
    utente: Utente | null;
    accedi: (utente: Utente) => void;
    esci: () => void;
    accessoAperto: ModoAccesso | null;
    apriAccesso: (modo?: ModoAccesso) => void;
    chiudiAccesso: () => void;
};

export const UtenteContext = createContext<ContestoUtente | null>(null);

export function useUtente() {
    const contesto = useContext(UtenteContext);
    if (!contesto) {
        throw new Error('useUtente va usato dentro UtenteProvider');
    }
    return contesto;
}
