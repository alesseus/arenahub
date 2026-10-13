package com.hub.arenahub.Services;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Model.Torneo;
import com.hub.arenahub.Repository.GiochiRepo;
import com.hub.arenahub.Repository.TorneiRepo;

@Service
public class TorneiSrv {

	@Autowired
	private TorneiRepo torneiRepo;

	@Autowired
	private GiochiRepo giochiRepo;

	@Autowired
	private IscrizioniSrv iscrizioniSrv;

	public List<Torneo> getAllTornei() {
		return torneiRepo.findAll().stream()
				.sorted(Comparator.comparing(Torneo::getData_ora_inizio))
				.collect(Collectors.toList());
	}

	public Optional<Torneo> vediTorneo(Long id_torneo) {
		return torneiRepo.findById(id_torneo);
	}

	public Torneo addTorneo(Torneo nuovo) {
		nuovo.setId_torneo(null);
		nuovo.setStato("aperto");
		return torneiRepo.save(nuovo);
	}

	public Torneo cambiaTorneo(Torneo esistente, Torneo cambiato) {
		esistente.setNome(cambiato.getNome());
		esistente.setDescrizione(cambiato.getDescrizione());
		esistente.setId_gioco(cambiato.getId_gioco());
		esistente.setData_ora_inizio(cambiato.getData_ora_inizio());
		esistente.setData_ora_fine(cambiato.getData_ora_fine());
		esistente.setPosti_max(cambiato.getPosti_max());
		Torneo salvato = torneiRepo.save(esistente);
		iscrizioniSrv.promuovi(salvato);
		return salvato;
	}

	public Torneo cambiaStato(Torneo torneo, String stato) {
		torneo.setStato(stato);
		return torneiRepo.save(torneo);
	}

	public Torneo completaTorneo(Torneo torneo) {
		int iscritti = iscrizioniSrv.contaIscritti(torneo.getId_torneo());
		torneo.setGioco(giochiRepo.findById(torneo.getId_gioco()).orElse(null));
		torneo.setIscritti(iscritti);
		torneo.setPosti_liberi(Math.max(0, torneo.getPosti_max() - iscritti));
		torneo.setIn_attesa(iscrizioniSrv.contaAttesa(torneo.getId_torneo()));
		return torneo;
	}

	public String controllaDati(Torneo torneo) {
		if (torneo.getNome() == null || torneo.getNome().isBlank()) {
			return "Il nome è obbligatorio";
		}
		if (torneo.getData_ora_inizio() == null || torneo.getData_ora_fine() == null) {
			return "Le date di inizio e fine sono obbligatorie";
		}
		if (!torneo.getData_ora_fine().isAfter(torneo.getData_ora_inizio())) {
			return "La data di fine deve essere successiva alla data di inizio";
		}
		if (torneo.getPosti_max() == null || torneo.getPosti_max() <= 0) {
			return "posti_max deve essere maggiore di 0";
		}
		if (torneo.getId_gioco() == null || !giochiRepo.existsById(torneo.getId_gioco())) {
			return "Gioco inesistente";
		}
		return null;
	}

}
