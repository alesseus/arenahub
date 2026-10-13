import { Link } from 'react-router';
import './NonTrovata.css';

function NonTrovata() {
    return (
        <main className="non-trovata">
            <p className="non-trovata-codice">404</p>
            <h1 className="page-title">Pagina non trovata</h1>
            <p className="non-trovata-testo">L'indirizzo che hai aperto non esiste o è stato spostato.</p>
            <Link to="/" className="btn btn-primary">Torna alla home</Link>
        </main>
    );
}

export default NonTrovata;
