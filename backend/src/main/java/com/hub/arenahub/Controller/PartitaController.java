package com.hub.arenahub.Controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hub.arenahub.Dto.RisultatiRequest;
import com.hub.arenahub.Dto.RisultatoPartita;
import com.hub.arenahub.Dto.RisTorneo;
import com.hub.arenahub.Model.Iscrizione;
import com.hub.arenahub.Model.Partecipazione;
import com.hub.arenahub.Model.Partita;
import com.hub.arenahub.Model.Torneo;
import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Services.IscrizioniSrv;
import com.hub.arenahub.Services.PartecipazioniSrv;
import com.hub.arenahub.Services.PartiteSrv;
import com.hub.arenahub.Services.TorneiSrv;
import com.hub.arenahub.Services.UtentiSrv;

@RestController
@RequestMapping("/api/partite")
public class PartitaController {

	@Autowired
	private PartiteSrv partiteSrv;

	@Autowired
	private TorneiSrv torneiSrv;

	@Autowired
	private PartecipazioniSrv partecipazioniSrv;

	@Autowired
	private IscrizioniSrv iscrizioniSrv;

	@Autowired
	private UtentiSrv utentiSrv;

	@GetMapping
	public ResponseEntity<?> calendario(@RequestParam(required = false) Long id_torneo,
			@RequestParam(required = false) String dal,
			@RequestParam(required = false) String al) {
		LocalDate giornoDal;
		LocalDate giornoAl;
		try {
			giornoDal = dal != null ? LocalDate.parse(dal) : null;
			giornoAl = al != null ? LocalDate.parse(al) : null;
		} catch (DateTimeParseException e) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Filtro non valido");
		}
		if (giornoDal != null && giornoAl != null && giornoDal.isAfter(giornoAl)) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Filtro non valido");
		}

		Map<Long, Torneo> tornei = torneiSrv.getAllTornei().stream()
				.collect(Collectors.toMap(Torneo::getId_torneo, t -> t));

		List<Partita> partite = partiteSrv.getAllPartite().stream()
				.filter(p -> id_torneo == null || id_torneo.equals(p.getId_torneo()))
				.filter(p -> giornoDal == null || !p.getData_ora().toLocalDate().isBefore(giornoDal))
				.filter(p -> giornoAl == null || !p.getData_ora().toLocalDate().isAfter(giornoAl))
				.collect(Collectors.toList());

		for (Partita partita : partite) {
			Torneo torneo = tornei.get(partita.getId_torneo());
			if (torneo != null) {
				partita.setTorneo(new RisTorneo(torneo.getId_torneo(), torneo.getNome()));
			}
		}
		return ResponseEntity.ok(partite);
	}

	@PutMapping("/{id_partita}/risultati")
	public ResponseEntity<?> inserisciRisultati(@PathVariable Long id_partita, @RequestBody RisultatiRequest request,
			@SessionAttribute(value = "utente", required = false) String email) {
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		if (!Boolean.TRUE.equals(utente.get().getAdmin())) {
			return errore(HttpStatus.FORBIDDEN, "Operazione riservata agli admin");
		}
		Optional<Partita> optional = partiteSrv.vediPartita(id_partita);
		if (optional.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Partita non trovata");
		}
		Partita partita = optional.get();

		List<RisultatoPartita> risultati = request.getPartecipazioni();
		if (risultati == null || risultati.isEmpty()) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Inserisci almeno un risultato");
		}
		Set<String> giocatori = new HashSet<>();
		for (RisultatoPartita r : risultati) {
			if (r.getEmail() == null || r.getEmail().isBlank()) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Email del giocatore obbligatoria");
			}
			if (!giocatori.add(r.getEmail().trim().toLowerCase())) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Giocatore ripetuto: " + r.getEmail());
			}
			if ((r.getPunteggio() != null && r.getPunteggio() < 0) || (r.getPosizione() != null && r.getPosizione() < 1)) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Punteggio o posizione non validi per " + r.getEmail());
			}
			Optional<Iscrizione> iscrizione = iscrizioniSrv.vediIscrizione(partita.getId_torneo(), r.getEmail().trim());
			if (iscrizione.isEmpty() || iscrizione.get().isAttesa()) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Giocatore non iscritto al torneo: " + r.getEmail());
			}
		}

		for (RisultatoPartita r : risultati) {
			String emailGiocatore = r.getEmail().trim();
			Partecipazione partecipazione = partecipazioniSrv.vediPartecipazione(id_partita, emailGiocatore)
					.orElseGet(Partecipazione::new);
			partecipazione.setId_partita(id_partita);
			partecipazione.setId_torneo(partita.getId_torneo());
			partecipazione.setEmail(emailGiocatore);
			partecipazione.setPunteggio(r.getPunteggio());
			partecipazione.setPosizione(r.getPosizione());
			partecipazione.setQualificato(Boolean.TRUE.equals(r.getQualificato()));
			partecipazioniSrv.salvaPartecipazione(partecipazione);
		}

		partita.setStato("conclusa");
		return ResponseEntity.ok(partiteSrv.salvaPartita(partita));
	}

	private ResponseEntity<?> errore(HttpStatus status, String messaggio) {
		return ResponseEntity.status(status).body(Map.of("errore", messaggio));
	}

}
