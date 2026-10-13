import { useState, type FormEvent } from 'react';
import { login, registrazione } from '../api';
import { useUtente } from '../utente-context';
import Modale from './Modale';
import './AccessoModale.css';

function AccessoModale() {
    const { accessoAperto, apriAccesso, chiudiAccesso, accedi } = useUtente();
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errore, setErrore] = useState('');
    const [inCorso, setInCorso] = useState(false);

    const isRegistrazione = accessoAperto === 'registrazione';

    function cambiaModo() {
        setErrore('');
        apriAccesso(isRegistrazione ? 'login' : 'registrazione');
    }

    function chiudi() {
        setErrore('');
        setPassword('');
        chiudiAccesso();
    }

    async function invia(e: FormEvent) {
        e.preventDefault();
        setErrore('');
        setInCorso(true);
        try {
            const utente = isRegistrazione
                ? await registrazione({ nome, cognome, email, password })
                : await login(email, password);
            setPassword('');
            accedi(utente);
        } catch (err) {
            setErrore(err instanceof Error ? err.message : 'Qualcosa è andato storto');
        } finally {
            setInCorso(false);
        }
    }

    return (
        <Modale aperta={accessoAperto !== null} titolo={isRegistrazione ? 'Registrati' : 'Accedi'} onChiudi={chiudi}>
            <form className="accesso-form" onSubmit={invia}>
                {errore && <p className="modale-errore" role="alert">{errore}</p>}

                {isRegistrazione && (
                    <div className="accesso-riga">
                        <label className="campo">
                            <span>Nome</span>
                            <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" required />
                        </label>
                        <label className="campo">
                            <span>Cognome</span>
                            <input value={cognome} onChange={(e) => setCognome(e.target.value)} autoComplete="family-name" required />
                        </label>
                    </div>
                )}

                <label className="campo">
                    <span>E-mail</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                </label>

                <label className="campo">
                    <span>Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isRegistrazione ? 'new-password' : 'current-password'}
                        required
                    />
                </label>

                <button type="submit" className="btn btn-primary accesso-invia" disabled={inCorso}>
                    {inCorso ? 'Attendi...' : isRegistrazione ? 'Registrati' : 'Accedi'}
                </button>

                <p className="accesso-cambio">
                    {isRegistrazione ? 'Hai già un account?' : 'Non hai un account?'}{' '}
                    <button type="button" onClick={cambiaModo}>
                        {isRegistrazione ? 'Accedi' : 'Registrati'}
                    </button>
                </p>
            </form>
        </Modale>
    );
}

export default AccessoModale;
