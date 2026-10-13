package com.hub.arenahub.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Model.Utente;
import com.hub.arenahub.Repository.UtentiRepo;

@Service
public class UtentiSrv {

	@Autowired
	private UtentiRepo utentiRepo;

	public Optional<Utente> vediUtente(String email) {
		if (email == null || email.isBlank()) {
			return Optional.empty();
		}
		return utentiRepo.findById(email);
	}

}
