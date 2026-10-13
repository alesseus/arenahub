export type Utente = {
    email: string;
    nome: string;
    cognome: string;
    admin: boolean;
};

const CHIAVE = 'arenahub-utente';

export function getUtente(): Utente | null {
    try {
        const salvato = localStorage.getItem(CHIAVE);
        return salvato ? JSON.parse(salvato) : null;
    } catch {
        return null;
    }
}

export function salvaUtente(utente: Utente) {
    localStorage.setItem(CHIAVE, JSON.stringify(utente));
}

export function cancellaUtente() {
    localStorage.removeItem(CHIAVE);
}
