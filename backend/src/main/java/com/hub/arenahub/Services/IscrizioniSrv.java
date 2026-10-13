package com.hub.arenahub.Services;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Dto.MioStato;
import com.hub.arenahub.Model.Iscrizione;
import com.hub.arenahub.Model.IscrizioneId;
import com.hub.arenahub.Model.Torneo;
import com.hub.arenahub.Repository.IscrizioniRepo;

@Service
public class IscrizioniSrv {

	@Autowired
	private IscrizioniRepo iscrizioniRepo;

	public List<Iscrizione> getIscrizioniTorneo(Long id_torneo) {
		return iscrizioniRepo.findAll().stream()
				.filter(i -> i.getId_torneo().equals(id_torneo))
				.sorted(Comparator.comparing(Iscrizione::getData_iscrizione).thenComparing(Iscrizione::getEmail))
				.collect(Collectors.toList());
	}

	public List<Iscrizione> getIscritti(Long id_torneo) {
		return getIscrizioniTorneo(id_torneo).stream()
				.filter(i -> !i.isAttesa())
				.collect(Collectors.toList());
	}

	public List<Iscrizione> getListaAttesa(Long id_torneo) {
		List<Iscrizione> attesa = getIscrizioniTorneo(id_torneo).stream()
				.filter(Iscrizione::isAttesa)
				.collect(Collectors.toList());
		for (int i = 0; i < attesa.size(); i++) {
			attesa.get(i).setPosizione_attesa(i + 1);
		}
		return attesa;
	}

	public int contaIscritti(Long id_torneo) {
		return getIscritti(id_torneo).size();
	}

	public int contaAttesa(Long id_torneo) {
		return getListaAttesa(id_torneo).size();
	}

	public Optional<Iscrizione> vediIscrizione(Long id_torneo, String email) {
		return iscrizioniRepo.findById(new IscrizioneId(id_torneo, email));
	}

	public Integer posizioneAttesa(Long id_torneo, String email) {
		return getListaAttesa(id_torneo).stream()
				.filter(i -> i.getEmail().equals(email))
				.map(Iscrizione::getPosizione_attesa)
				.findFirst()
				.orElse(null);
	}

	public MioStato mioStato(Long id_torneo, String email) {
		Optional<Iscrizione> iscrizione = vediIscrizione(id_torneo, email);
		if (iscrizione.isEmpty()) {
			return new MioStato(false, false, null);
		}
		if (iscrizione.get().isAttesa()) {
			return new MioStato(false, true, posizioneAttesa(id_torneo, email));
		}
		return new MioStato(true, false, null);
	}

	public Iscrizione addIscrizione(Torneo torneo, String email) {
		Iscrizione nuova = new Iscrizione();
		nuova.setId_torneo(torneo.getId_torneo());
		nuova.setEmail(email);
		nuova.setData_iscrizione(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
		nuova.setAttesa(contaIscritti(torneo.getId_torneo()) >= torneo.getPosti_max());
		iscrizioniRepo.save(nuova);
		if (nuova.isAttesa()) {
			nuova.setPosizione_attesa(posizioneAttesa(torneo.getId_torneo(), email));
		}
		return nuova;
	}

	public void cancellaIscrizione(Torneo torneo, Iscrizione iscrizione) {
		iscrizioniRepo.delete(iscrizione);
		promuovi(torneo);
	}

	public void promuovi(Torneo torneo) {
		int iscritti = contaIscritti(torneo.getId_torneo());
		for (Iscrizione i : getListaAttesa(torneo.getId_torneo())) {
			if (iscritti >= torneo.getPosti_max()) {
				break;
			}
			i.setAttesa(false);
			iscrizioniRepo.save(i);
			iscritti++;
		}
	}

}
