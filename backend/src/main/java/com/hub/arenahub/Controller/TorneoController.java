package com.hub.arenahub.Controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hub.arenahub.Model.Torneo;
import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Services.IscrizioniSrv;
import com.hub.arenahub.Services.TorneiSrv;
import com.hub.arenahub.Services.UtentiSrv;

@RestController
@RequestMapping("/api/tornei")
public class TorneoController {

	@Autowired
	private TorneiSrv torneiSrv;

	@Autowired
	private IscrizioniSrv iscrizioniSrv;

	@Autowired
	private UtentiSrv utentiSrv;

	@GetMapping
	public ResponseEntity<?> elenco(@RequestParam(required = false) String stato,
			@RequestParam(required = false) Long id_gioco,
			@RequestParam(required = false) String data,
			@RequestParam(required = false) Integer limit) {
		if (stato != null && !List.of("aperto", "chiuso", "concluso").contains(stato)) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Filtro non valido");
		}
		if (limit != null && limit <= 0) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Filtro non valido");
		}
		LocalDate giorno = null;
		if (data != null) {
			try {
				giorno = LocalDate.parse(data);
			} catch (DateTimeParseException e) {
				return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Filtro non valido");
			}
		}
		LocalDate giornoScelto = giorno;
		List<Torneo> tornei = torneiSrv.getAllTornei().stream()
				.filter(t -> stato == null || stato.equals(t.getStato()))
				.filter(t -> id_gioco == null || id_gioco.equals(t.getId_gioco()))
				.filter(t -> giornoScelto == null || giornoScelto.equals(t.getData_ora_inizio().toLocalDate()))
				.limit(limit != null ? limit : Long.MAX_VALUE)
				.map(torneiSrv::completaTorneo)
				.collect(Collectors.toList());
		return ResponseEntity.ok(tornei);
	}

	@GetMapping("/{id_torneo}")
	public ResponseEntity<?> dettaglio(@PathVariable Long id_torneo,
			@SessionAttribute(value = "utente", required = false) String email) {
		Optional<Torneo> optional = torneiSrv.vediTorneo(id_torneo);
		if (optional.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		Torneo torneo = torneiSrv.completaTorneo(optional.get());
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isPresent()) {
			torneo.setMio_stato(iscrizioniSrv.mioStato(id_torneo, utente.get().getEmail()));
		}
		return ResponseEntity.ok(torneo);
	}

	@PostMapping
	public ResponseEntity<?> crea(@RequestBody Torneo nuovo,
			@SessionAttribute(value = "utente", required = false) String email) {
		ResponseEntity<?> negato = controllaAdmin(email);
		if (negato != null) {
			return negato;
		}
		String datiNonValidi = torneiSrv.controllaDati(nuovo);
		if (datiNonValidi != null) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, datiNonValidi);
		}
		return ResponseEntity.status(HttpStatus.CREATED).body(torneiSrv.addTorneo(nuovo));
	}

	@PutMapping("/{id_torneo}")
	public ResponseEntity<?> modifica(@PathVariable Long id_torneo, @RequestBody Torneo cambiato,
			@SessionAttribute(value = "utente", required = false) String email) {
		ResponseEntity<?> negato = controllaAdmin(email);
		if (negato != null) {
			return negato;
		}
		Optional<Torneo> optional = torneiSrv.vediTorneo(id_torneo);
		if (optional.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		String datiNonValidi = torneiSrv.controllaDati(cambiato);
		if (datiNonValidi != null) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, datiNonValidi);
		}
		if (cambiato.getPosti_max() < iscrizioniSrv.contaIscritti(id_torneo)) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Ci sono già più iscritti del nuovo limite");
		}
		return ResponseEntity.ok(torneiSrv.cambiaTorneo(optional.get(), cambiato));
	}

	@PutMapping("/{id_torneo}/stato")
	public ResponseEntity<?> cambiaStato(@PathVariable Long id_torneo, @RequestBody Map<String, String> body,
			@SessionAttribute(value = "utente", required = false) String email) {
		ResponseEntity<?> negato = controllaAdmin(email);
		if (negato != null) {
			return negato;
		}
		Optional<Torneo> optional = torneiSrv.vediTorneo(id_torneo);
		if (optional.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		String attuale = optional.get().getStato();
		String nuovo = body.get("stato");
		boolean ammessa = ("aperto".equals(attuale) && "chiuso".equals(nuovo))
				|| ("chiuso".equals(attuale) && "concluso".equals(nuovo));
		if (!ammessa) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Transizione di stato non valida");
		}
		Torneo torneo = torneiSrv.cambiaStato(optional.get(), nuovo);
		return ResponseEntity.ok(Map.of("id_torneo", torneo.getId_torneo(), "stato", torneo.getStato()));
	}

	private ResponseEntity<?> controllaAdmin(String email) {
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		if (!Boolean.TRUE.equals(utente.get().getAdmin())) {
			return errore(HttpStatus.FORBIDDEN, "Operazione riservata agli admin");
		}
		return null;
	}

	private ResponseEntity<?> errore(HttpStatus status, String messaggio) {
		return ResponseEntity.status(status).body(Map.of("errore", messaggio));
	}

}
