BEGIN;

INSERT INTO giochi (id_gioco, nome, path_foto) OVERRIDING SYSTEM VALUE VALUES
(1,  'Call of Duty',      '/img/giochi/call-of-duty.jpg'),
(2,  'Valorant',          '/img/giochi/valorant.jpg'),
(3,  'Fortnite',          '/img/giochi/fortnite.jpg'),
(4,  'Counter-Strike 2',  '/img/giochi/counter-strike-2.jpg'),
(5,  'League of Legends', '/img/giochi/league-of-legends.jpg'),
(6,  'Dota 2',            '/img/giochi/dota-2.jpg'),
(7,  'Rocket League',     '/img/giochi/rocket-league.jpg'),
(8,  'EA Sports FC 25',   '/img/giochi/ea-sports-fc.jpg'),
(9,  'Apex Legends',      '/img/giochi/apex-legends.jpg'),
(10, 'Street Fighter 6',  '/img/giochi/street-fighter-6.jpg'),
(11, 'Tekken 8',          '/img/giochi/tekken-8.jpg'),
(12, 'Rainbow Six Siege', '/img/giochi/rainbow-six-siege.jpg'),
(13, 'Minecraft',         '/img/giochi/minecraft.jpg');


INSERT INTO Utenti (email, nome, cognome, password, admin) VALUES
('luca.verdi@yahoo.com',     'Luca',   'Verdi',   'Password1!', false),
('giulia.bianchi@libero.it', 'Giulia', 'Bianchi', 'Password2!', false),
('admin@gmail.com',          'Marco',  'Rossi',   'Password3!', true),
('test1@arenahub.test',      'Mario',  'Rossi',   'Password4!', false),
('test2@arenahub.test',      'Giulia', 'Bianchi', 'Password5!', false),
('test3@arenahub.test',      'Luca',   'Verdi',   'Password6!', false),
('test4@arenahub.test',      'Sara',   'Neri',    'Password7!', false),
('test5@arenahub.test',      'Paolo',  'Gialli',  'Password8!', false),
('test6@arenahub.test',      'Anna',   'Blu',     'Password9!', false),
('test7@arenahub.test',      'Marco',  'Viola',   'Password10!', false),
('test8@arenahub.test',      'Elena',  'Rosa',    'Password11!', false),
('giocatore1@arenahub.test', 'Luca',   'Bianchi', 'Password12!', false),
('giocatore2@arenahub.test', 'Giulia', 'Russo',   'Password13!', false),
('giocatore3@arenahub.test', 'Matteo', 'Romano',  'Password14!', false),
('giocatore4@arenahub.test', 'Sara',   'Colombo', 'Password15!', false),
('giocatore5@arenahub.test', 'Davide', 'Ricci',   'Password16!', false),
('giocatore6@arenahub.test', 'Chiara', 'Marino',  'Password17!', false);


INSERT INTO tornei (id_torneo, nome, data_inizio, data_fine, stato, posti, descrizione, id_gioco) OVERRIDING SYSTEM VALUE VALUES
(4, 'Call of Duty Autumn Cup', '2026-11-05 14:00:00+00', '2026-11-07 19:00:00+00', 'chiuso', 16,
    'Torneo di Call of Duty a eliminazione diretta: squadre da 4 giocatori si sfidano in modalità Hardpoint e Dominio.', 1),
(6, 'Fortnite Cup', '2026-09-01 18:00:00+00', '2026-09-02 21:00:00+00', 'concluso', 32,
    'Torneo di Fortnite in modalità Solo: sei partite di qualificazione e classifica finale a punti.', 3),
(7, 'Torneo di Test', '2026-10-13 15:30:00+00', '2026-10-14 19:03:00+00', 'concluso', 8,
    'Test', 11),
(8, 'R6 Season Cup', '2026-10-13 16:50:00+00', '2026-10-14 16:50:00+00', 'aperto', 10,
    NULL, 12),
(9, 'Rocket League Cup', '2026-10-21 18:00:00+00', '2026-10-21 22:00:00+00', 'chiuso', 6,
    'Torneo 1 contro 1 a eliminazione diretta.', 7);

INSERT INTO iscrizioni (email, id_torneo, data_isc, attesa) VALUES
('test1@arenahub.test',      7, '2026-10-13 13:06:18+00', false),
('test2@arenahub.test',      7, '2026-10-13 13:06:20+00', false),
('test3@arenahub.test',      7, '2026-10-13 13:06:22+00', false),
('test4@arenahub.test',      7, '2026-10-13 13:06:23+00', false),
('test5@arenahub.test',      7, '2026-10-13 13:06:25+00', false),
('test6@arenahub.test',      7, '2026-10-13 13:06:27+00', false),
('test7@arenahub.test',      7, '2026-10-13 13:06:28+00', false),
('test8@arenahub.test',      7, '2026-10-13 13:06:30+00', false),
('admin@gmail.com',          8, '2026-10-13 15:03:10+00', false),
('giocatore1@arenahub.test', 9, '2026-10-14 09:00:46+00', false),
('giocatore2@arenahub.test', 9, '2026-10-14 09:00:47+00', false),
('giocatore3@arenahub.test', 9, '2026-10-14 09:00:49+00', false),
('giocatore4@arenahub.test', 9, '2026-10-14 09:00:50+00', false),
('giocatore5@arenahub.test', 9, '2026-10-14 09:00:52+00', false),
('giocatore6@arenahub.test', 9, '2026-10-14 09:00:53+00', false);

INSERT INTO partite (id_partita, id_torneo, turno, data, stato) OVERRIDING SYSTEM VALUE VALUES
(1,  7, 1, '2026-10-13 15:20:00+00', 'conclusa'),
(2,  7, 1, '2026-10-13 15:20:00+00', 'conclusa'),
(3,  7, 1, '2026-10-13 15:20:00+00', 'conclusa'),
(4,  7, 1, '2026-10-13 15:20:00+00', 'conclusa'),
(5,  7, 2, '2026-10-13 15:43:00+00', 'conclusa'),
(6,  7, 2, '2026-10-13 15:43:00+00', 'conclusa'),
(7,  7, 3, '2026-10-13 15:44:00+00', 'conclusa'),
(8,  9, 1, '2026-10-14 11:04:00+00', 'conclusa'),
(9,  9, 1, '2026-10-14 11:04:00+00', 'conclusa'),
(10, 9, 1, '2026-10-14 11:04:00+00', 'conclusa'),
(11, 9, 2, '2026-10-14 11:05:00+00', 'conclusa');

INSERT INTO partecipazioni (id_partita, id_torneo, email, punteggio, posizione, qualificato) VALUES
(1,  7, 'test1@arenahub.test',      5,   2, false),
(1,  7, 'test2@arenahub.test',      10,  1, true),
(2,  7, 'test3@arenahub.test',      5,   1, true),
(2,  7, 'test4@arenahub.test',      2,   2, false),
(3,  7, 'test5@arenahub.test',      6,   1, true),
(3,  7, 'test6@arenahub.test',      4,   2, false),
(4,  7, 'test7@arenahub.test',      5,   1, true),
(4,  7, 'test8@arenahub.test',      3,   2, false),
(5,  7, 'test2@arenahub.test',      78,  1, true),
(5,  7, 'test3@arenahub.test',      43,  2, false),
(6,  7, 'test5@arenahub.test',      56,  2, false),
(6,  7, 'test7@arenahub.test',      99,  1, true),
(7,  7, 'test2@arenahub.test',      100, 2, false),
(7,  7, 'test7@arenahub.test',      102, 1, true),
(8,  9, 'giocatore1@arenahub.test', 10,  2, false),
(8,  9, 'giocatore2@arenahub.test', 11,  1, true),
(9,  9, 'giocatore3@arenahub.test', 323, 1, true),
(9,  9, 'giocatore4@arenahub.test', 21,  2, false),
(10, 9, 'giocatore5@arenahub.test', 12,  1, true),
(10, 9, 'giocatore6@arenahub.test', 11,  2, false),
(11, 9, 'giocatore2@arenahub.test', 12,  2, false),
(11, 9, 'giocatore3@arenahub.test', 13,  1, true);

SELECT setval(pg_get_serial_sequence('giochi',  'id_gioco'),   (SELECT MAX(id_gioco)   FROM giochi));
SELECT setval(pg_get_serial_sequence('tornei',  'id_torneo'),  (SELECT MAX(id_torneo)  FROM tornei));
SELECT setval(pg_get_serial_sequence('partite', 'id_partita'), (SELECT MAX(id_partita) FROM partite));

COMMIT;
