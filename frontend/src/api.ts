import { getUtente, type Utente } from './sessione';
import type { Iscrizione, Torneo, TorneoMio } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export class ErroreApi extends Error {
    stato: number;

    constructor(stato: number, messaggio: string) {
        super(messaggio);
        this.stato = stato;
    }
}

async function chiama<T>(percorso: string, opzioni: RequestInit = {}): Promise<T> {
    const utente = getUtente();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (utente) {
        headers['Utente-Loggato'] = utente.email;
    }

    const risposta = await fetch(`${API_URL}${percorso}`, { ...opzioni, headers });

    if (!risposta.ok) {
        const corpo = await risposta.json().catch(() => null);
        throw new ErroreApi(risposta.status, corpo?.errore ?? 'Qualcosa è andato storto');
    }
    if (risposta.status === 204) {
        return undefined as T;
    }
    return risposta.json();
}

export function getTornei(filtri = '') {
    return chiama<Torneo[]>(`/api/tornei${filtri}`);
}

export function getTorneo(id: string) {
    return chiama<Torneo>(`/api/tornei/${id}`);
}

export function iscriviti(id: number) {
    return chiama<Iscrizione>(`/api/tornei/${id}/iscrizioni`, { method: 'POST' });
}

export function annullaIscrizione(id: number) {
    return chiama<void>(`/api/tornei/${id}/iscrizioni`, { method: 'DELETE' });
}

export function login(email: string, password: string) {
    return chiama<Utente>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export function registrazione(dati: { nome: string; cognome: string; email: string; password: string }) {
    return chiama<Utente>('/api/auth/registrazione', {
        method: 'POST',
        body: JSON.stringify(dati),
    });
}

export function logout() {
    return chiama<void>('/api/auth/logout', { method: 'POST' });
}

export function getMieiTornei() {
    return chiama<TorneoMio[]>('/api/utenti/me/tornei');
}

export function modificaProfilo(dati: { nome: string; cognome: string }) {
    return chiama<Utente>('/api/utenti/me', {
        method: 'PATCH',
        body: JSON.stringify(dati),
    });
}
