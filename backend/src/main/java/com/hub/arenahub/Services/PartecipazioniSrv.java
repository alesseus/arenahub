package com.hub.arenahub.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Model.Partecipazione;
import com.hub.arenahub.Model.PartecipazioneId;
import com.hub.arenahub.Repository.PartecipazioniRepo;

@Service
public class PartecipazioniSrv {

	@Autowired
	private PartecipazioniRepo partecipazioniRepo;

	public Optional<Partecipazione> vediPartecipazione(Long id_partita, String email) {
		return partecipazioniRepo.findById(new PartecipazioneId(id_partita, email));
	}

	public Partecipazione salvaPartecipazione(Partecipazione partecipazione) {
		return partecipazioniRepo.save(partecipazione);
	}

}
