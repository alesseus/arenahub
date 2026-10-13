import type { Torneo } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export async function getTornei(filtri = ''): Promise<Torneo[]> {
    const risposta = await fetch(`${API_URL}/api/tornei${filtri}`);
    if (!risposta.ok) {
        throw new Error('Impossibile caricare i tornei');
    }
    return risposta.json();
}
