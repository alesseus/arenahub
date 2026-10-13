package com.hub.arenahub.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder.BCryptVersion;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Repository.UtentiRepo;

@Service
public class UtentiSrv {

	@Autowired
	private UtentiRepo utentiRepo;

	private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder(BCryptVersion.$2Y, 10);

	public Optional<Utente> vediUtente(String email) {
		if (email == null || email.isBlank()) {
			return Optional.empty();
		}
		return utentiRepo.findByEmailIgnoreCase(email.trim());
	}

	public Utente addUtente(Utente nuovo) {
		return utentiRepo.save(nuovo);
	}

	public Utente aggUtente(Utente aggiornato) {
		return utentiRepo.save(aggiornato);
	}

	public String passwordHash(String password) {
		return bcrypt.encode(password);
	}

	public boolean passwordVerify(String password, Utente utente) {
		String salvata = utente.getPassword();
		if (salvata == null) {
			return false;
		}
		if (salvata.startsWith("$2")) {
			return bcrypt.matches(password, salvata);
		}
		if (salvata.equals(password)) {
			utente.setPassword(passwordHash(password));
			utentiRepo.save(utente);
			return true;
		}
		return false;
	}

}
