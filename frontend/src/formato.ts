export function dataBreve(data: string) {
    const d = new Date(data);
    const giorno = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    const ora = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return `${giorno}, ${ora}`;
}

export function dataLunga(data: string) {
    const d = new Date(data);
    const giorno = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const ora = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return `${giorno}, ${ora}`;
}

export function fotoValida(path: string | null | undefined): path is string {
    return !!path && (path.startsWith('/') || path.startsWith('http'));
}
