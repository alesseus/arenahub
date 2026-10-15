package com.hub.arenahub.Controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hub.arenahub.Dto.GiocatorePartita;
import com.hub.arenahub.Dto.NuovaPartitaRequest;
import com.hub.arenahub.Dto.PartecipantePartita;
import com.hub.arenahub.Dto.Classifica;
import com.hub.arenahub.Model.Iscrizione;
import com.hub.arenahub.Model.Partecipazione;
import com.hub.arenahub.Model.Partita;
import com.hub.arenahub.Model.Torneo;
import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Services.GiochiSrv;
import com.hub.arenahub.Services.IscrizioniSrv;
import com.hub.arenahub.Services.PartecipazioniSrv;
import com.hub.arenahub.Services.PartiteSrv;
import com.hub.arenahub.Services.TorneiSrv;
import com.hub.arenahub.Services.UtentiSrv;

@RestController
@RequestMapping("/api/tornei")
public class PartitaTorneoController {

	@Autowired
	private PartiteSrv partiteSrv;

	@Autowired
	private PartecipazioniSrv partecipazioniSrv;

	@Autowired
	private TorneiSrv torneiSrv;

	@Autowired
	private IscrizioniSrv iscrizioniSrv;

	@Autowired
	private UtentiSrv utentiSrv;

	@Autowired
	private GiochiSrv giochiSrv;

	@GetMapping("/{id_torneo}/partite")
	public ResponseEntity<?> partiteTorneo(@PathVariable Long id_torneo) {
		if (torneiSrv.vediTorneo(id_torneo).isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}

		List<Partita> partite = partiteSrv.getPartiteTorneo(id_torneo);
		for (Partita partita : partite) {
			List<PartecipantePartita> partecipanti = new ArrayList<>();
			for (Partecipazione p : partecipazioniSrv.getPartecipazioniPartita(partita.getId_partita())) {
				Optional<Utente> giocatore = utentiSrv.vediUtente(p.getEmail());
				partecipanti.add(new PartecipantePartita(
						p.getEmail(),
						giocatore.map(Utente::getNome).orElse(null),
						giocatore.map(Utente::getCognome).orElse(null),
						p.getPunteggio(),
						p.getPosizione(),
						p.isQualificato()));
			}
			partecipanti.sort(Comparator.comparing(PartecipantePartita::getPosizione,
					Comparator.nullsLast(Comparator.naturalOrder()))
					.thenComparing(PartecipantePartita::getEmail));
			partita.setPartecipazioni(partecipanti);
		}
		return ResponseEntity.ok(partite);
	}

	@PostMapping("/{id_torneo}/partite")
	public ResponseEntity<?> creaPartita(@PathVariable Long id_torneo, @RequestBody NuovaPartitaRequest request,
			@SessionAttribute(value = "utente", required = false) String email) {
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		if (!Boolean.TRUE.equals(utente.get().getAdmin())) {
			return errore(HttpStatus.FORBIDDEN, "Operazione riservata agli admin");
		}
		Optional<Torneo> torneo = torneiSrv.vediTorneo(id_torneo);
		if (torneo.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}

		if (request.getTurno() == null || request.getTurno() < 1) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Il turno deve essere maggiore di 0");
		}
		if (request.getData_ora() == null) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "La data della partita è obbligatoria");
		}
		List<GiocatorePartita> giocatori = request.getPartecipazioni();
		if (giocatori == null || giocatori.size() < 2) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Servono almeno due giocatori");
		}

		List<Partita> partiteTorneo = partiteSrv.getPartiteTorneo(id_torneo);
		long turno = request.getTurno();
		if (turno > 1) {
			List<Partita> turnoPrecedente = partiteTorneo.stream()
					.filter(p -> p.getTurno() == turno - 1)
					.toList();
			if (turnoPrecedente.isEmpty() || turnoPrecedente.stream().anyMatch(p -> !"conclusa".equals(p.getStato()))) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Turno precedente non concluso");
			}
		}

		Set<String> giaInQuestoTurno = new HashSet<>();
		for (Partita p : partiteTorneo) {
			if (p.getTurno() == turno) {
				for (Partecipazione partecipazione : partecipazioniSrv.getPartecipazioniPartita(p.getId_partita())) {
					giaInQuestoTurno.add(partecipazione.getEmail().toLowerCase());
				}
			}
		}

		Set<String> visti = new HashSet<>();
		List<String> emails = new ArrayList<>();
		for (GiocatorePartita g : giocatori) {
			if (g.getEmail() == null || g.getEmail().isBlank()) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Email del giocatore obbligatoria");
			}
			String emailGiocatore = g.getEmail().trim();
			if (!visti.add(emailGiocatore.toLowerCase())) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Giocatore ripetuto: " + emailGiocatore);
			}
			Optional<Iscrizione> iscrizione = iscrizioniSrv.vediIscrizione(id_torneo, emailGiocatore);
			if (iscrizione.isEmpty() || iscrizione.get().isAttesa()) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Giocatore non iscritto al torneo: " + emailGiocatore);
			}
			if (giaInQuestoTurno.contains(emailGiocatore.toLowerCase())) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT,
						"Giocatore già in un'altra partita dello stesso turno: " + emailGiocatore);
			}
			emails.add(iscrizione.get().getEmail());
		}

		Partita nuova = new Partita();
		nuova.setId_torneo(id_torneo);
		nuova.setTurno(turno);
		nuova.setData_ora(request.getData_ora());
		Partita salvata = partiteSrv.addPartita(nuova);

		for (String emailGiocatore : emails) {
			Partecipazione partecipazione = new Partecipazione();
			partecipazione.setId_partita(salvata.getId_partita());
			partecipazione.setId_torneo(id_torneo);
			partecipazione.setEmail(emailGiocatore);
			partecipazione.setQualificato(false);
			partecipazioniSrv.salvaPartecipazione(partecipazione);
		}

		return ResponseEntity.status(HttpStatus.CREATED).body(salvata);
	}

	@GetMapping("/{id_torneo}/classifica")
	public ResponseEntity<?> classifica(@PathVariable Long id_torneo) {
		Optional<Torneo> torneo = torneiSrv.vediTorneo(id_torneo);
		if (torneo.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}

		Map<String, Long> punti = new LinkedHashMap<>();
		for (Partita partita : partiteSrv.getPartiteTorneo(id_torneo)) {
			if (!"conclusa".equals(partita.getStato())) {
				continue;
			}
			for (Partecipazione p : partecipazioniSrv.getPartecipazioniPartita(partita.getId_partita())) {
				long punteggio = p.getPunteggio() != null ? p.getPunteggio() : 0;
				punti.merge(p.getEmail(), punteggio, Long::sum);
			}
		}

		List<Classifica> classifica = new ArrayList<>();
		for (Map.Entry<String, Long> voce : punti.entrySet()) {
			Optional<Utente> giocatore = utentiSrv.vediUtente(voce.getKey());
			classifica.add(new Classifica(
					voce.getKey(),
					giocatore.map(Utente::getNome).orElse(null),
					giocatore.map(Utente::getCognome).orElse(null),
					voce.getValue()));
		}
		classifica.sort(Comparator.comparing(Classifica::getPunteggio).reversed()
				.thenComparing(Classifica::getEmail));
		for (int i = 0; i < classifica.size(); i++) {
			boolean pariMerito = i > 0 && classifica.get(i).getPunteggio() == classifica.get(i - 1).getPunteggio();
			classifica.get(i).setPosizione(pariMerito ? classifica.get(i - 1).getPosizione() : i + 1);
		}

		Map<String, Object> datiTorneo = new LinkedHashMap<>();
		datiTorneo.put("id_torneo", torneo.get().getId_torneo());
		datiTorneo.put("nome", torneo.get().getNome());
		datiTorneo.put("gioco", giochiSrv.vediGioco(torneo.get().getId_gioco()).orElse(null));

		Map<String, Object> risposta = new LinkedHashMap<>();
		risposta.put("torneo", datiTorneo);
		risposta.put("classifica", classifica);
		return ResponseEntity.ok(risposta);
	}

	private ResponseEntity<?> errore(HttpStatus status, String messaggio) {
		return ResponseEntity.status(status).body(Map.of("errore", messaggio));
	}

}
