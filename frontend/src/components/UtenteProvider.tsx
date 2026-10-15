import { useEffect, useState, type ReactNode } from 'react';
import { getProfilo, logout, SESSIONE_SCADUTA } from '../api';
import { cancellaUtente, getUtente, salvaUtente, type Utente } from '../sessione';
import { UtenteContext, type ModoAccesso } from '../utente-context';

function UtenteProvider({ children }: { children: ReactNode }) {
    const [utente, setUtente] = useState<Utente | null>(() => getUtente());
    const [accessoAperto, setAccessoAperto] = useState<ModoAccesso | null>(null);

    useEffect(() => {
        function sessioneScaduta() {
            cancellaUtente();
            setUtente(null);
        }

        window.addEventListener(SESSIONE_SCADUTA, sessioneScaduta);
        if (getUtente()) {
            getProfilo()
                .then((aggiornato) => {
                    salvaUtente(aggiornato);
                    setUtente(aggiornato);
                })
                .catch(() => {});
        }
        return () => window.removeEventListener(SESSIONE_SCADUTA, sessioneScaduta);
    }, []);

    function accedi(nuovo: Utente) {
        salvaUtente(nuovo);
        setUtente(nuovo);
        setAccessoAperto(null);
    }

    function esci() {
        logout().catch(() => {});
        cancellaUtente();
        setUtente(null);
    }

    return (
        <UtenteContext.Provider
            value={{
                utente,
                accedi,
                esci,
                accessoAperto,
                apriAccesso: (modo = 'login') => setAccessoAperto(modo),
                chiudiAccesso: () => setAccessoAperto(null),
            }}
        >
            {children}
        </UtenteContext.Provider>
    );
}

export default UtenteProvider;
