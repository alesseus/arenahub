-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.utenti (
  email character varying NOT NULL CHECK (email::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text),
  nome character varying NOT NULL,
  cognome character varying NOT NULL,
  password character varying NOT NULL,
  admin boolean NOT NULL DEFAULT false,
  CONSTRAINT utenti_pkey PRIMARY KEY (email)
);
CREATE TABLE public.tornei (
  id_torneo bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome character varying NOT NULL,
  data_inizio timestamp with time zone NOT NULL,
  data_fine timestamp with time zone NOT NULL,
  stato character varying NOT NULL DEFAULT 'aperto'::character varying CHECK (stato::text = ANY (ARRAY['aperto'::character varying, 'chiuso'::character varying, 'in corso'::character varying, 'concluso'::character varying]::text[])),
  posti bigint NOT NULL CHECK (posti > 0),
  descrizione character varying,
  id_gioco bigint NOT NULL,
  CONSTRAINT tornei_pkey PRIMARY KEY (id_torneo),
  CONSTRAINT tornei_id_gioco_fkey FOREIGN KEY (id_gioco) REFERENCES public.giochi(id_gioco)
);
CREATE TABLE public.iscrizioni (
  email character varying NOT NULL,
  id_torneo bigint NOT NULL,
  data_isc timestamp with time zone NOT NULL DEFAULT now(),
  attesa boolean NOT NULL DEFAULT false,
  CONSTRAINT iscrizioni_pkey PRIMARY KEY (id_torneo, email),
  CONSTRAINT iscrizioni_email_fkey FOREIGN KEY (email) REFERENCES public.utenti(email),
  CONSTRAINT iscrizioni_torneo_fkey FOREIGN KEY (id_torneo) REFERENCES public.tornei(id_torneo)
);
CREATE TABLE public.giochi (
  id_gioco bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome character varying NOT NULL UNIQUE,
  path_foto character varying,
  CONSTRAINT giochi_pkey PRIMARY KEY (id_gioco)
);
CREATE TABLE public.partite (
  id_partita bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_torneo bigint NOT NULL,
  turno bigint NOT NULL,
  data timestamp with time zone NOT NULL,
  stato character varying NOT NULL DEFAULT 'programmata'::character varying CHECK (stato::text = ANY (ARRAY['programmata'::character varying, 'in_corso'::character varying, 'conclusa'::character varying]::text[])),
  CONSTRAINT partite_pkey PRIMARY KEY (id_partita),
  CONSTRAINT partite_id_torneo_fkey FOREIGN KEY (id_torneo) REFERENCES public.tornei(id_torneo)
);
CREATE TABLE public.partecipazioni (
  id_partita bigint NOT NULL,
  id_torneo bigint NOT NULL,
  email character varying NOT NULL,
  punteggio bigint,
  posizione bigint,
  qualificato boolean NOT NULL DEFAULT false,
  CONSTRAINT partecipazioni_pkey PRIMARY KEY (id_partita, email),
  CONSTRAINT fk_partecipazioni_partita FOREIGN KEY (id_partita) REFERENCES public.partite(id_partita),
  CONSTRAINT fk_partecipazioni_iscrizione FOREIGN KEY (email) REFERENCES public.iscrizioni(email),
  CONSTRAINT fk_partecipazioni_iscrizione FOREIGN KEY (id_torneo) REFERENCES public.iscrizioni(id_torneo)
);