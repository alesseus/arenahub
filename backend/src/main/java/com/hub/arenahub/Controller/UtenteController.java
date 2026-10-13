package com.hub.arenahub.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hub.arenahub.Dto.ProfiloRequest;
import com.hub.arenahub.Model.Iscrizione;
import com.hub.arenahub.Model.Torneo;
import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Services.IscrizioniSrv;
import com.hub.arenahub.Services.TorneiSrv;
import com.hub.arenahub.Services.UtentiSrv;

@RestController
@RequestMapping("/api/utenti/me")
public class UtenteController {

	@Autowired
	private UtentiSrv utentiSrv;

	@Autowired
	private IscrizioniSrv iscrizioniSrv;

	@Autowired
	private TorneiSrv torneiSrv;

	@GetMapping
	public ResponseEntity<?> profilo(@RequestHeader(value = "Utente-Loggato", required = false) String email) {
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		return ResponseEntity.ok(utente.get());
	}

	@PatchMapping
	public ResponseEntity<?> modificaProfilo(@RequestBody ProfiloRequest request,
			@RequestHeader(value = "Utente-Loggato", required = false) String email) {
		Optional<Utente> optional = utentiSrv.vediUtente(email);
		if (optional.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		if ((request.getNome() != null && request.getNome().isBlank())
				|| (request.getCognome() != null && request.getCognome().isBlank())) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Nome e cognome non possono essere vuoti");
		}

		Utente utente = optional.get();
		if (request.getNome() != null) {
			utente.setNome(request.getNome().trim());
		}
		if (request.getCognome() != null) {
			utente.setCognome(request.getCognome().trim());
		}
		return ResponseEntity.ok(utentiSrv.aggUtente(utente));
	}

	@GetMapping("/tornei")
	public ResponseEntity<?> mieiTornei(@RequestParam(required = false) String stato,
			@RequestHeader(value = "Utente-Loggato", required = false) String email) {
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		if (stato != null && !List.of("aperto", "chiuso", "concluso").contains(stato)) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Filtro non valido");
		}

		List<Map<String, Object>> tornei = new ArrayList<>();
		for (Iscrizione iscrizione : iscrizioniSrv.getIscrizioniUtente(utente.get().getEmail())) {
			Optional<Torneo> torneo = torneiSrv.vediTorneo(iscrizione.getId_torneo());
			if (torneo.isEmpty() || (stato != null && !stato.equals(torneo.get().getStato()))) {
				continue;
			}
			Map<String, Object> riga = new LinkedHashMap<>();
			riga.put("id_torneo", torneo.get().getId_torneo());
			riga.put("nome", torneo.get().getNome());
			riga.put("data_ora_inizio", torneo.get().getData_ora_inizio());
			riga.put("stato", torneo.get().getStato());
			riga.put("data_iscrizione", iscrizione.getData_iscrizione());
			riga.put("attesa", iscrizione.isAttesa());
			riga.put("posizione_attesa", iscrizione.isAttesa()
					? iscrizioniSrv.posizioneAttesa(iscrizione.getId_torneo(), iscrizione.getEmail())
					: null);
			tornei.add(riga);
		}
		tornei.sort(Comparator.comparing(r -> (LocalDateTime) r.get("data_ora_inizio")));
		return ResponseEntity.ok(tornei);
	}

	private ResponseEntity<?> errore(HttpStatus status, String messaggio) {
		return ResponseEntity.status(status).body(Map.of("errore", messaggio));
	}

}
