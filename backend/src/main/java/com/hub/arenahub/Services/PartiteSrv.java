package com.hub.arenahub.Services;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Model.Partita;
import com.hub.arenahub.Repository.PartiteRepo;

@Service
public class PartiteSrv {

	@Autowired
	private PartiteRepo partiteRepo;

	public List<Partita> getAllPartite() {
		return partiteRepo.findAll().stream()
				.sorted(Comparator.comparing(Partita::getData_ora).thenComparing(Partita::getId_partita))
				.collect(Collectors.toList());
	}

	public Optional<Partita> vediPartita(Long id_partita) {
		return partiteRepo.findById(id_partita);
	}

	public Partita salvaPartita(Partita partita) {
		return partiteRepo.save(partita);
	}

}
