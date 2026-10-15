import type { Utente } from './sessione';
import type { Classifica, DatiTorneo, Gioco, Impostazioni, Iscrizione, IscrittiTorneo, Partita, Torneo, TorneoMio } from './types';

export const SESSIONE_SCADUTA = 'arenahub-sessione-scaduta';

export class ErroreApi extends Error {
    stato: number;

    constructor(stato: number, messaggio: string) {
        super(messaggio);
        this.stato = stato;
    }
}

async function chiama<T>(percorso: string, opzioni: RequestInit = {}): Promise<T> {
    let risposta: Response;
    try {
        risposta = await fetch(percorso, {
            ...opzioni,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
        });
    } catch {
        throw new ErroreApi(0, 'Il server non risponde. Riprova tra qualche secondo.');
    }

    if (risposta.status === 401 && !percorso.startsWith('/api/auth/')) {
        window.dispatchEvent(new Event(SESSIONE_SCADUTA));
    }
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

export function getProfilo() {
    return chiama<Utente>('/api/utenti/me');
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

export function getGiochi() {
    return chiama<Gioco[]>('/api/giochi');
}

export function creaTorneo(dati: DatiTorneo) {
    return chiama<Torneo>('/api/tornei', {
        method: 'POST',
        body: JSON.stringify(dati),
    });
}

export function modificaTorneo(id: number, dati: DatiTorneo) {
    return chiama<Torneo>(`/api/tornei/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dati),
    });
}

export function cambiaStato(id: number, stato: 'chiuso' | 'concluso') {
    return chiama<{ id_torneo: number; stato: string }>(`/api/tornei/${id}/stato`, {
        method: 'PUT',
        body: JSON.stringify({ stato }),
    });
}

export function getIscritti(id: number) {
    return chiama<IscrittiTorneo>(`/api/tornei/${id}/iscritti`);
}

export function getPartite(id: number) {
    return chiama<Partita[]>(`/api/tornei/${id}/partite`);
}

export function creaPartita(id: number, dati: { turno: number; data_ora: string; partecipazioni: { email: string }[] }) {
    return chiama<Partita>(`/api/tornei/${id}/partite`, {
        method: 'POST',
        body: JSON.stringify(dati),
    });
}

export function salvaRisultati(
    idPartita: number,
    partecipazioni: { email: string; punteggio: number | null; posizione: number; qualificato: boolean }[],
) {
    return chiama<Partita>(`/api/partite/${idPartita}/risultati`, {
        method: 'PUT',
        body: JSON.stringify({ partecipazioni }),
    });
}

export function getClassifica(id: string) {
    return chiama<Classifica>(`/api/tornei/${id}/classifica`);
}

export function getImpostazioni() {
    return chiama<Impostazioni>('/api/impostazioni');
}

export function salvaImpostazioni(dati: Impostazioni) {
    return chiama<Impostazioni>('/api/impostazioni', {
        method: 'PUT',
        body: JSON.stringify(dati),
    });
}
