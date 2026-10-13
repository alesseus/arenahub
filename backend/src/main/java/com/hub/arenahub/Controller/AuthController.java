package com.hub.arenahub.Controller;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hub.arenahub.Dto.LoginRequest;
import com.hub.arenahub.Dto.RegistrazioneRequest;
import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Services.UtentiSrv;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private UtentiSrv utentiSrv;

	@PostMapping("/registrazione")
	public ResponseEntity<?> registrazione(@RequestBody RegistrazioneRequest request) {
		if (vuoto(request.getNome()) || vuoto(request.getCognome()) || vuoto(request.getEmail())
				|| vuoto(request.getPassword())) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Nome, cognome, email e password sono obbligatori");
		}
		String email = request.getEmail().trim().toLowerCase();
		if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Email non valida");
		}
		if (request.getPassword().getBytes(StandardCharsets.UTF_8).length > 72) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "La password può avere al massimo 72 caratteri");
		}
		if (utentiSrv.vediUtente(email).isPresent()) {
			return errore(HttpStatus.CONFLICT, "Email già in uso");
		}

		Utente utente = new Utente();
		utente.setEmail(email);
		utente.setNome(request.getNome().trim());
		utente.setCognome(request.getCognome().trim());
		utente.setPassword(utentiSrv.passwordHash(request.getPassword()));
		utente.setAdmin(false);

		return ResponseEntity.status(HttpStatus.CREATED).body(utentiSrv.addUtente(utente));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request) {
		if (vuoto(request.getEmail()) || vuoto(request.getPassword())) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Email e password obbligatorie");
		}
		Optional<Utente> utente = utentiSrv.vediUtente(request.getEmail());
		if (utente.isEmpty() || !utentiSrv.passwordVerify(request.getPassword(), utente.get())) {
			return errore(HttpStatus.UNAUTHORIZED, "Email o password errati");
		}
		return ResponseEntity.ok(utente.get());
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestHeader(value = "Utente-Loggato", required = false) String email) {
		if (utentiSrv.vediUtente(email).isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		return ResponseEntity.noContent().build();
	}

	private boolean vuoto(String valore) {
		return valore == null || valore.isBlank();
	}

	private ResponseEntity<?> errore(HttpStatus status, String messaggio) {
		return ResponseEntity.status(status).body(Map.of("errore", messaggio));
	}

}
