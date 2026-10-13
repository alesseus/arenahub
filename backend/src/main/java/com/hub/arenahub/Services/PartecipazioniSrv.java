package com.hub.arenahub.Services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Model.Partecipazione;
import com.hub.arenahub.Model.PartecipazioneId;
import com.hub.arenahub.Repository.PartecipazioniRepo;

@Service
public class PartecipazioniSrv {

	@Autowired
	private PartecipazioniRepo partecipazioniRepo;

	public List<Partecipazione> getPartecipazioniPartita(Long id_partita) {
		return partecipazioniRepo.findAll().stream()
				.filter(p -> p.getId_partita().equals(id_partita))
				.collect(Collectors.toList());
	}

	public Optional<Partecipazione> vediPartecipazione(Long id_partita, String email) {
		return partecipazioniRepo.findById(new PartecipazioneId(id_partita, email));
	}

	public Partecipazione salvaPartecipazione(Partecipazione partecipazione) {
		return partecipazioniRepo.save(partecipazione);
	}

}
