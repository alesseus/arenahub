# ArenaHub — API

Base URL: `/api` · Formato: JSON · Date: ISO 8601 · Campi: camelCase · Errori: `{"errore": "..."}`

## Codici di errore comuni

| Codice | Significato |
|---|---|
| 401 | Utente non autenticato |
| 403 | Operazione riservata agli admin |
| 404 | Risorsa non trovata |
| 409 | Conflitto con dati esistenti |
| 422 | Dati non validi |

## Elenco endpoint

| Metodo | Path | Descrizione | Accesso |
|---|---|---|---|
| POST | `/api/auth/registrazione` | Registrazione nuovo utente | pubblico |
| POST | `/api/auth/login` | Login | pubblico |
| POST | `/api/auth/logout` | Logout | utente |
| GET | `/api/utenti/me` | Profilo dell'utente loggato | utente |
| PATCH | `/api/utenti/me` | Modifica del profilo | utente |
| GET | `/api/utenti/me/tornei` | Tornei dell'utente loggato | utente |
| GET | `/api/giochi` | Elenco dei giochi | pubblico |
| GET | `/api/tornei` | Elenco dei tornei | pubblico |
| GET | `/api/tornei/{id}` | Dettaglio di un torneo | pubblico |
| POST | `/api/tornei` | Creazione di un torneo | admin |
| PUT | `/api/tornei/{id}` | Modifica di un torneo | admin |
| PUT | `/api/tornei/{id}/stato` | Cambio di stato di un torneo | admin |
| POST | `/api/tornei/{id}/iscrizioni` | Iscrizione al torneo | utente |
| DELETE | `/api/tornei/{id}/iscrizioni` | Annullamento dell'iscrizione | utente |
| GET | `/api/tornei/{id}/iscritti` | Iscritti e lista d'attesa | admin |
| GET | `/api/partite` | Calendario di tutte le partite | pubblico |
| GET | `/api/tornei/{id}/partite` | Partite di un torneo | pubblico |
| POST | `/api/tornei/{id}/partite` | Creazione di una partita | admin |
| PUT | `/api/partite/{id}/risultati` | Inserimento risultati | admin |
| GET | `/api/tornei/{id}/classifica` | Classifica del torneo | pubblico |

---

## Autenticazione

### `POST /api/auth/registrazione` — pubblico

**Body**
```json
{ "nome": "Mario", "cognome": "Rossi", "email": "mario@its.it", "password": "segreta123" }
```

**201**
```json
{ "email": "mario@its.it", "nome": "Mario", "cognome": "Rossi", "admin": false }
```

- `409` → `{"errore": "Email già in uso"}`
- `422` → campi mancanti o email non valida

### `POST /api/auth/login` — pubblico

**Body**
```json
{ "email": "mario@its.it", "password": "segreta123" }
```

**200**
```json
{ "email": "mario@its.it", "nome": "Mario", "cognome": "Rossi", "admin": false }
```

- `401` → `{"errore": "Email o password errati"}`
- `422` → `{"errore": "Email e password obbligatorie"}`

### `POST /api/auth/logout` — utente

**204** — nessun contenuto

- `401` → utente non autenticato

---

## Profilo

### `GET /api/utenti/me` — utente

**200**
```json
{ "email": "mario@its.it", "nome": "Mario", "cognome": "Rossi", "admin": false }
```

- `401` → utente non autenticato

### `PATCH /api/utenti/me` — utente

Campi modificabili: `nome`, `cognome`.

**Body**
```json
{ "nome": "Mario", "cognome": "Rossi" }
```

**200**
```json
{ "email": "mario@its.it", "nome": "Mario", "cognome": "Rossi", "admin": false }
```

- `401` → utente non autenticato
- `422` → `{"errore": "Nome e cognome non possono essere vuoti"}`

### `GET /api/utenti/me/tornei` — utente

Query (opzionale): `?stato=aperto|chiuso|concluso`

**200**
```json
[ { "torneoId": 3, "nome": "Torneo d'autunno", "dataOraInizio": "2026-10-16T15:00:00",
    "stato": "aperto", "attesa": false },
  { "torneoId": 5, "nome": "Sfida di Natale", "dataOraInizio": "2026-12-18T16:00:00",
    "stato": "aperto", "attesa": true, "posizioneAttesa": 2 } ]
```

- `401` → utente non autenticato

---

## Giochi

### `GET /api/giochi` — pubblico

**200**
```json
[ { "id": 1, "nome": "Calcio virtuale" }, { "id": 2, "nome": "Picchiaduro" } ]
```

---

## Tornei

### `GET /api/tornei` — pubblico

Query (opzionali): `?stato=` `&gioco=` `&data=` `&limit=`

**200**
```json
[ { "id": 3, "nome": "Torneo d'autunno", "gioco": "Calcio virtuale",
    "dataOraInizio": "2026-10-16T15:00:00", "dataOraFine": "2026-10-16T19:00:00",
    "postiMax": 16, "iscritti": 7, "postiLiberi": 9, "inAttesa": 0,
    "stato": "aperto" } ]
```

- `422` → filtro non valido

### `GET /api/tornei/{id}` — pubblico

`mioStato` è presente solo con utente autenticato.

**200**
```json
{ "id": 3, "nome": "Torneo d'autunno", "descrizione": "...",
  "idGioco": 1, "gioco": "Calcio virtuale", "stato": "aperto",
  "dataOraInizio": "2026-10-16T15:00:00", "dataOraFine": "2026-10-16T19:00:00",
  "postiMax": 16, "iscritti": 7, "postiLiberi": 9, "inAttesa": 0,
  "mioStato": { "iscritto": false, "attesa": false, "posizioneAttesa": null } }
```

- `404` → `{"errore": "Torneo non trovato"}`

### `POST /api/tornei` — admin

Il torneo viene creato con `stato = "aperto"`.

**Body**
```json
{ "nome": "Coppa ITS", "descrizione": "...", "idGioco": 2,
  "dataOraInizio": "2026-11-21T14:30:00", "dataOraFine": "2026-11-21T18:30:00",
  "postiMax": 8 }
```

**201**
```json
{ "id": 9, "nome": "Coppa ITS", "stato": "aperto", ... }
```

- `401` → utente non autenticato
- `403` → `{"errore": "Operazione riservata agli admin"}`
- `422` → dati non validi (es. `postiMax ≤ 0`, `idGioco` inesistente)

### `PUT /api/tornei/{id}` — admin

**Body**
```json
{ "nome": "Coppa ITS 2026", "descrizione": "...", "idGioco": 2,
  "dataOraInizio": "2026-11-22T14:30:00", "dataOraFine": "2026-11-22T18:30:00",
  "postiMax": 10 }
```

**200** — torneo aggiornato

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → torneo inesistente
- `422` → `{"errore": "Ci sono già più iscritti del nuovo limite"}`

### `PUT /api/tornei/{id}/stato` — admin

Transizioni ammesse: `aperto → chiuso → concluso`.

**Body**
```json
{ "stato": "chiuso" }
```

**200**
```json
{ "id": 3, "stato": "chiuso" }
```

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → torneo inesistente
- `422` → `{"errore": "Transizione di stato non valida"}`

---

## Iscrizioni

### `POST /api/tornei/{id}/iscrizioni` — utente

Nessun body. Se il torneo è pieno l'utente entra in lista d'attesa.

**201** — posto disponibile
```json
{ "torneoId": 3, "email": "mario@its.it", "data": "2026-10-14T10:30:00", "attesa": false }
```

**201** — lista d'attesa
```json
{ "torneoId": 3, "email": "mario@its.it", "data": "2026-10-14T10:30:00",
  "attesa": true, "posizioneAttesa": 2 }
```

- `401` → utente non autenticato
- `404` → `{"errore": "Torneo non trovato"}`
- `409` → `{"errore": "Sei già iscritto a questo torneo"}`
- `422` → `{"errore": "Iscrizioni chiuse"}`

### `DELETE /api/tornei/{id}/iscrizioni` — utente

Annulla l'iscrizione o l'attesa. Se si libera un posto, il primo in lista d'attesa viene promosso.

**204** — nessun contenuto

- `401` → utente non autenticato
- `404` → iscrizione inesistente
- `422` → `{"errore": "Non è più possibile annullare l'iscrizione"}`

### `GET /api/tornei/{id}/iscritti` — admin

**200**
```json
{ "torneo": { "id": 3, "nome": "Torneo d'autunno", "postiMax": 16 },
  "iscritti": [
    { "numero": 1, "nome": "Mario", "cognome": "Rossi", "email": "mario@its.it",
      "dataIscrizione": "2026-10-10T09:12:00" },
    { "numero": 2, "nome": "Giulia", "cognome": "Bianchi", "email": "giulia@its.it",
      "dataIscrizione": "2026-10-10T11:40:00" } ],
  "listaAttesa": [
    { "posizione": 1, "nome": "Luca", "cognome": "Verdi", "email": "luca@its.it",
      "dataIscrizione": "2026-10-11T08:00:00" } ] }
```

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → torneo inesistente

---

## Partite e classifiche

### `GET /api/partite` — pubblico

Query (opzionali): `?torneo=` `&dal=` `&al=`

**200**
```json
[ { "id": 14, "idTorneo": 3, "torneo": "Torneo d'autunno", "turno": 1,
    "dataOra": "2026-10-16T16:00:00", "stato": "programmata" } ]
```

### `GET /api/tornei/{id}/partite` — pubblico

**200**
```json
[ { "id": 14, "turno": 1, "dataOra": "2026-10-16T16:00:00", "stato": "programmata",
    "giocatori": [ { "email": "mario@its.it", "nome": "Mario Rossi" } ] } ]
```

- `404` → torneo inesistente

### `POST /api/tornei/{id}/partite` — admin

**Body**
```json
{ "turno": 2, "dataOra": "2026-10-23T16:00:00", "giocatori": ["mario@its.it", "luca@its.it"] }
```

**201** — partita creata

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → torneo inesistente
- `422` → giocatore non iscritto al torneo
- `422` → turno precedente non concluso
- `422` → giocatore già in un'altra partita dello stesso turno

### `PUT /api/partite/{id}/risultati` — admin

**Body**
```json
{ "risultati": [
    { "email": "mario@its.it", "punteggio": 10, "posizione": 1, "qualificato": true },
    { "email": "luca@its.it",  "punteggio": 4,  "posizione": 2, "qualificato": false } ] }
```

**200** — partita aggiornata, `stato = "conclusa"`

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → partita inesistente
- `422` → giocatore non iscritto al torneo

### `GET /api/tornei/{id}/classifica` — pubblico

**200**
```json
{ "torneo": { "id": 3, "nome": "Torneo d'autunno", "gioco": "Calcio virtuale" },
  "classifica": [
    { "posizione": 1, "utente": "Mario Rossi", "punteggio": 24 },
    { "posizione": 2, "utente": "Luca Bianchi", "punteggio": 18 } ] }
```

- `404` → torneo inesistente
