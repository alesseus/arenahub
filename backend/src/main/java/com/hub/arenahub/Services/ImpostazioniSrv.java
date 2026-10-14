package com.hub.arenahub.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Model.Impostazioni;
import com.hub.arenahub.Repository.ImpostazioniRepo;

@Service
public class ImpostazioniSrv {

	private static final short ID_IMPOSTAZIONI = 1;
	private static final int MAX_TORNEI_DEFAULT = 3;

	@Autowired
	private ImpostazioniRepo impostazioniRepo;

	public Impostazioni getImpostazioni() {
		return impostazioniRepo.findById(ID_IMPOSTAZIONI).orElseGet(() -> {
			Impostazioni nuove = new Impostazioni();
			nuove.setId(ID_IMPOSTAZIONI);
			nuove.setMax_tornei_utente(MAX_TORNEI_DEFAULT);
			return nuove;
		});
	}

	public int getMaxTorneiUtente() {
		return getImpostazioni().getMax_tornei_utente();
	}

	public Impostazioni cambiaMaxTornei(int max_tornei_utente) {
		Impostazioni impostazioni = getImpostazioni();
		impostazioni.setMax_tornei_utente(max_tornei_utente);
		return impostazioniRepo.save(impostazioni);
	}

}
