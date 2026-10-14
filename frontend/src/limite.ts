import type { TorneoMio } from './types';

export function torneiAttivi(tornei: TorneoMio[]) {
    return tornei.filter((t) => !t.attesa && t.stato !== 'concluso');
}

export function torneiInAttesa(tornei: TorneoMio[]) {
    return tornei.filter((t) => t.attesa && t.stato !== 'concluso');
}

export function elencoNomi(nomi: string[]) {
    if (nomi.length <= 1) return nomi.join('');
    return `${nomi.slice(0, -1).join(', ')} e ${nomi[nomi.length - 1]}`;
}
