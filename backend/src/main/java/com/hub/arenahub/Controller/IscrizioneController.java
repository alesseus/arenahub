package com.hub.arenahub.Controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hub.arenahub.Model.Iscrizione;
import com.hub.arenahub.Model.Torneo;
import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Services.ImpostazioniSrv;
import com.hub.arenahub.Services.IscrizioniSrv;
import com.hub.arenahub.Services.TorneiSrv;
import com.hub.arenahub.Services.UtentiSrv;

@RestController
@RequestMapping("/api/tornei")
public class IscrizioneController {

	@Autowired
	private IscrizioniSrv iscrizioniSrv;

	@Autowired
	private TorneiSrv torneiSrv;

	@Autowired
	private UtentiSrv utentiSrv;

	@Autowired
	private ImpostazioniSrv impostazioniSrv;

	@PostMapping("/{id_torneo}/iscrizioni")
	public ResponseEntity<?> iscrivi(@PathVariable Long id_torneo,
			@SessionAttribute(value = "utente", required = false) String email) {
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		Optional<Torneo> torneo = torneiSrv.vediTorneo(id_torneo);
		if (torneo.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		if (iscrizioniSrv.vediIscrizione(id_torneo, utente.get().getEmail()).isPresent()) {
			return errore(HttpStatus.CONFLICT, "Sei già iscritto a questo torneo");
		}
		if (!"aperto".equals(torneo.get().getStato())) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Iscrizioni chiuse");
		}
		if (iscrizioniSrv.limiteRaggiunto(utente.get().getEmail())) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT,
					"Hai raggiunto il limite di " + impostazioniSrv.getMaxTorneiUtente() + " tornei attivi");
		}
		Iscrizione nuova = iscrizioniSrv.addIscrizione(torneo.get(), utente.get().getEmail());
		return ResponseEntity.status(HttpStatus.CREATED).body(nuova);
	}

	@DeleteMapping("/{id_torneo}/iscrizioni")
	public ResponseEntity<?> annulla(@PathVariable Long id_torneo,
			@SessionAttribute(value = "utente", required = false) String email) {
		Optional<Utente> utente = utentiSrv.vediUtente(email);
		if (utente.isEmpty()) {
			return errore(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
		}
		Optional<Torneo> torneo = torneiSrv.vediTorneo(id_torneo);
		if (torneo.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		Optional<Iscrizione> iscrizione = iscrizioniSrv.vediIscrizione(id_torneo, utente.get().getEmail());
		if (iscrizione.isEmpty()) {
			return errore(HttpStatus.NOT_FOUND, "Iscrizione non trovata");
		}
		if (!"aperto".equals(torneo.get().getStato())) {
			return errore(HttpStatus.UNPROCESSABLE_CONTENT, "Non è più possibile annullare l'iscrizione");
		}
		iscrizioniSrv.cancellaIscrizione(torneo.get(), iscrizione.get());
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id_torneo}/iscritti")
	public ResponseEntity<?> iscritti(@PathVariable Long id_torneo,
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

		Map<String, Object> datiTorneo = new LinkedHashMap<>();
		datiTorneo.put("id_torneo", torneo.get().getId_torneo());
		datiTorneo.put("nome", torneo.get().getNome());
		datiTorneo.put("posti_max", torneo.get().getPosti_max());

		List<Map<String, Object>> iscritti = new ArrayList<>();
		for (Iscrizione i : iscrizioniSrv.getIscritti(id_torneo)) {
			iscritti.add(riga(i));
		}

		List<Map<String, Object>> listaAttesa = new ArrayList<>();
		for (Iscrizione i : iscrizioniSrv.getListaAttesa(id_torneo)) {
			Map<String, Object> riga = riga(i);
			riga.put("posizione_attesa", i.getPosizione_attesa());
			listaAttesa.add(riga);
		}

		Map<String, Object> risposta = new LinkedHashMap<>();
		risposta.put("torneo", datiTorneo);
		risposta.put("iscritti", iscritti);
		risposta.put("lista_attesa", listaAttesa);
		return ResponseEntity.ok(risposta);
	}

	private Map<String, Object> riga(Iscrizione iscrizione) {
		Optional<Utente> utente = utentiSrv.vediUtente(iscrizione.getEmail());
		Map<String, Object> riga = new LinkedHashMap<>();
		riga.put("email", iscrizione.getEmail());
		riga.put("nome", utente.map(Utente::getNome).orElse(null));
		riga.put("cognome", utente.map(Utente::getCognome).orElse(null));
		riga.put("data_iscrizione", iscrizione.getData_iscrizione());
		return riga;
	}

	private ResponseEntity<?> errore(HttpStatus status, String messaggio) {
		return ResponseEntity.status(status).body(Map.of("errore", messaggio));
	}

}
