package com.hub.arenahub.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hub.arenahub.Model.Impostazioni;
import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Services.ImpostazioniSrv;
import com.hub.arenahub.Services.UtentiSrv;

@RestController
@RequestMapping("/api/impostazioni")
public class ImpostazioniController {

	@Autowired
	private ImpostazioniSrv impostazioniSrv;

	@Autowired
	private UtentiSrv utentiSrv;

	@GetMapping
	public Impostazioni vediImpostazioni() {
		return impostazioniSrv.getImpostazioni();
	}

	@PutMapping
	public ResponseEntity<?> modifica(@RequestBody(required = false) Map<String, Object> body,
			@RequestHeader(value = "Utente-Loggato", required = false) String email) {
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		if (!Boolean.TRUE.equals(utente.get().getAdmin())) {
			return errore(HttpStatus.FORBIDDEN, "Operazione riservata agli admin");
		}
		Object valore = body != null ? body.get("max_tornei_utente") : null;
		if (!(valore instanceof Integer max) || max < 1) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Il limite deve essere un numero intero maggiore di 0");
		}
		return ResponseEntity.ok(impostazioniSrv.cambiaMaxTornei(max));
	}

	private ResponseEntity<?> errore(HttpStatus status, String messaggio) {
		return ResponseEntity.status(status).body(Map.of("errore", messaggio));
	}

}
