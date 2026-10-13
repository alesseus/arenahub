# ArenaHub — API

Base URL: `/api` · Formato: JSON · Date: ISO 8601 · Errori: `{"errore": "..."}`

I campi JSON hanno gli stessi nomi degli attributi del database. I campi calcolati (non salvati nel DB) sono: `iscritti`, `posti_liberi`, `in_attesa`, `posizione_attesa`, `mio_stato`.

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
| GET | `/api/tornei/{id_torneo}` | Dettaglio di un torneo | pubblico |
| POST | `/api/tornei` | Creazione di un torneo | admin |
| PUT | `/api/tornei/{id_torneo}` | Modifica di un torneo | admin |
| PUT | `/api/tornei/{id_torneo}/stato` | Cambio di stato di un torneo | admin |
| POST | `/api/tornei/{id_torneo}/iscrizioni` | Iscrizione al torneo | utente |
| DELETE | `/api/tornei/{id_torneo}/iscrizioni` | Annullamento dell'iscrizione | utente |
| GET | `/api/tornei/{id_torneo}/iscritti` | Iscritti e lista d'attesa | admin |
| GET | `/api/partite` | Calendario di tutte le partite | pubblico |
| GET | `/api/tornei/{id_torneo}/partite` | Partite di un torneo | pubblico |
| POST | `/api/tornei/{id_torneo}/partite` | Creazione di una partita | admin |
| PUT | `/api/partite/{id_partita}/risultati` | Inserimento risultati | admin |
| GET | `/api/tornei/{id_torneo}/classifica` | Classifica del torneo | pubblico |

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
[ { "id_torneo": 3, "nome": "Torneo d'autunno", "data_ora_inizio": "2026-10-16T15:00:00",
    "stato": "aperto", "data_iscrizione": "2026-10-10T09:12:00",
    "attesa": false, "posizione_attesa": null },
  { "id_torneo": 5, "nome": "Sfida di Natale", "data_ora_inizio": "2026-12-18T16:00:00",
    "stato": "aperto", "data_iscrizione": "2026-10-11T08:00:00",
    "attesa": true, "posizione_attesa": 2 } ]
```

- `401` → utente non autenticato

---

## Giochi

### `GET /api/giochi` — pubblico

**200**
```json
[ { "id_gioco": 1, "nome": "Calcio virtuale", "path_foto": "/img/giochi/calcio-virtuale.png" },
  { "id_gioco": 2, "nome": "Picchiaduro", "path_foto": null } ]
```

`path_foto` è il percorso dell'immagine del gioco; è `null` se il gioco non ha una foto.

---

## Tornei

### `GET /api/tornei` — pubblico

Query (opzionali): `?stato=` `&id_gioco=` `&data=` `&limit=`

**200**
```json
[ { "id_torneo": 3, "nome": "Torneo d'autunno",
    "gioco": { "id_gioco": 1, "nome": "Calcio virtuale", "path_foto": "/img/giochi/calcio-virtuale.png" },
    "data_ora_inizio": "2026-10-16T15:00:00", "data_ora_fine": "2026-10-16T19:00:00",
    "posti_max": 16, "stato": "aperto",
    "iscritti": 7, "posti_liberi": 9, "in_attesa": 0 } ]
```

- `422` → filtro non valido

### `GET /api/tornei/{id_torneo}` — pubblico

`mio_stato` è presente solo con utente autenticato.

**200**
```json
{ "id_torneo": 3, "nome": "Torneo d'autunno", "descrizione": "...",
  "gioco": { "id_gioco": 1, "nome": "Calcio virtuale", "path_foto": "/img/giochi/calcio-virtuale.png" },
  "data_ora_inizio": "2026-10-16T15:00:00", "data_ora_fine": "2026-10-16T19:00:00",
  "posti_max": 16, "stato": "aperto",
  "iscritti": 7, "posti_liberi": 9, "in_attesa": 0,
  "mio_stato": { "iscritto": false, "attesa": false, "posizione_attesa": null } }
```

- `404` → `{"errore": "Torneo non trovato"}`

### `POST /api/tornei` — admin

Il torneo viene creato con `stato = "aperto"`.

**Body**
```json
{ "nome": "Coppa ITS", "descrizione": "...", "id_gioco": 2,
  "data_ora_inizio": "2026-11-21T14:30:00", "data_ora_fine": "2026-11-21T18:30:00",
  "posti_max": 8 }
```

**201**
```json
{ "id_torneo": 9, "nome": "Coppa ITS", "descrizione": "...", "id_gioco": 2,
  "data_ora_inizio": "2026-11-21T14:30:00", "data_ora_fine": "2026-11-21T18:30:00",
  "posti_max": 8, "stato": "aperto" }
```

- `401` → utente non autenticato
- `403` → `{"errore": "Operazione riservata agli admin"}`
- `422` → dati non validi (es. `posti_max ≤ 0`, `id_gioco` inesistente)

### `PUT /api/tornei/{id_torneo}` — admin

**Body**
```json
{ "nome": "Coppa ITS 2026", "descrizione": "...", "id_gioco": 2,
  "data_ora_inizio": "2026-11-22T14:30:00", "data_ora_fine": "2026-11-22T18:30:00",
  "posti_max": 10 }
```

**200**
```json
{ "id_torneo": 9, "nome": "Coppa ITS 2026", "descrizione": "...", "id_gioco": 2,
  "data_ora_inizio": "2026-11-22T14:30:00", "data_ora_fine": "2026-11-22T18:30:00",
  "posti_max": 10, "stato": "aperto" }
```

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → torneo inesistente
- `422` → `{"errore": "Ci sono già più iscritti del nuovo limite"}`

### `PUT /api/tornei/{id_torneo}/stato` — admin

Transizioni ammesse: `aperto → chiuso → concluso`.

**Body**
```json
{ "stato": "chiuso" }
```

**200**
```json
{ "id_torneo": 3, "stato": "chiuso" }
```

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → torneo inesistente
- `422` → `{"errore": "Transizione di stato non valida"}`

---

## Iscrizioni

### `POST /api/tornei/{id_torneo}/iscrizioni` — utente

Nessun body. Se il torneo è pieno l'utente entra in lista d'attesa.

**201** — posto disponibile
```json
{ "id_torneo": 3, "email": "mario@its.it", "data_iscrizione": "2026-10-14T10:30:00",
  "attesa": false, "posizione_attesa": null }
```

**201** — lista d'attesa
```json
{ "id_torneo": 3, "email": "mario@its.it", "data_iscrizione": "2026-10-14T10:30:00",
  "attesa": true, "posizione_attesa": 2 }
```

- `401` → utente non autenticato
- `404` → `{"errore": "Torneo non trovato"}`
- `409` → `{"errore": "Sei già iscritto a questo torneo"}`
- `422` → `{"errore": "Iscrizioni chiuse"}`

### `DELETE /api/tornei/{id_torneo}/iscrizioni` — utente

Annulla l'iscrizione o l'attesa. Se si libera un posto, il primo in lista d'attesa viene promosso.

**204** — nessun contenuto

- `401` → utente non autenticato
- `404` → iscrizione inesistente
- `422` → `{"errore": "Non è più possibile annullare l'iscrizione"}`

### `GET /api/tornei/{id_torneo}/iscritti` — admin

**200**
```json
{ "torneo": { "id_torneo": 3, "nome": "Torneo d'autunno", "posti_max": 16 },
  "iscritti": [
    { "email": "mario@its.it", "nome": "Mario", "cognome": "Rossi",
      "data_iscrizione": "2026-10-10T09:12:00" },
    { "email": "giulia@its.it", "nome": "Giulia", "cognome": "Bianchi",
      "data_iscrizione": "2026-10-10T11:40:00" } ],
  "lista_attesa": [
    { "email": "luca@its.it", "nome": "Luca", "cognome": "Verdi",
      "data_iscrizione": "2026-10-11T08:00:00", "posizione_attesa": 1 } ] }
```

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → torneo inesistente

---

## Partite e classifiche

### `GET /api/partite` — pubblico

Query (opzionali): `?id_torneo=` `&dal=` `&al=`

**200**
```json
[ { "id_partita": 14, "id_torneo": 3, "turno": 1,
    "data_ora": "2026-10-16T16:00:00", "stato": "programmata",
    "torneo": { "id_torneo": 3, "nome": "Torneo d'autunno" } } ]
```

### `GET /api/tornei/{id_torneo}/partite` — pubblico

**200**
```json
[ { "id_partita": 14, "id_torneo": 3, "turno": 1,
    "data_ora": "2026-10-16T16:00:00", "stato": "programmata",
    "partecipazioni": [
      { "email": "mario@its.it", "nome": "Mario", "cognome": "Rossi",
        "punteggio": null, "posizione": null, "qualificato": false } ] } ]
```

- `404` → torneo inesistente

### `POST /api/tornei/{id_torneo}/partite` — admin

**Body**
```json
{ "turno": 2, "data_ora": "2026-10-23T16:00:00",
  "partecipazioni": [ { "email": "mario@its.it" }, { "email": "luca@its.it" } ] }
```

**201**
```json
{ "id_partita": 21, "id_torneo": 3, "turno": 2,
  "data_ora": "2026-10-23T16:00:00", "stato": "programmata" }
```

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → torneo inesistente
- `422` → giocatore non iscritto al torneo
- `422` → turno precedente non concluso
- `422` → giocatore già in un'altra partita dello stesso turno

### `PUT /api/partite/{id_partita}/risultati` — admin

**Body**
```json
{ "partecipazioni": [
    { "email": "mario@its.it", "punteggio": 10, "posizione": 1, "qualificato": true },
    { "email": "luca@its.it",  "punteggio": 4,  "posizione": 2, "qualificato": false } ] }
```

**200**
```json
{ "id_partita": 21, "id_torneo": 3, "turno": 2,
  "data_ora": "2026-10-23T16:00:00", "stato": "conclusa" }
```

- `401` → utente non autenticato
- `403` → utente non admin
- `404` → partita inesistente
- `422` → giocatore non iscritto al torneo

### `GET /api/tornei/{id_torneo}/classifica` — pubblico

**200**
```json
{ "torneo": { "id_torneo": 3, "nome": "Torneo d'autunno",
              "gioco": { "id_gioco": 1, "nome": "Calcio virtuale",
                         "path_foto": "/img/giochi/calcio-virtuale.png" } },
  "classifica": [
    { "posizione": 1, "email": "mario@its.it", "nome": "Mario", "cognome": "Rossi", "punteggio": 24 },
    { "posizione": 2, "email": "luca@its.it", "nome": "Luca", "cognome": "Bianchi", "punteggio": 18 } ] }
```

- `404` → torneo inesistente
