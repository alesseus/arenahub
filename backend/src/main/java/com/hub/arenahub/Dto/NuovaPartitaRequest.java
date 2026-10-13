package com.hub.arenahub.Dto;

import java.time.LocalDateTime;
import java.util.List;

public class NuovaPartitaRequest {

	private Long turno;
	private LocalDateTime data_ora;
	private List<GiocatorePartita> partecipazioni;

	public Long getTurno() {
		return turno;
	}

	public void setTurno(Long turno) {
		this.turno = turno;
	}

	public LocalDateTime getData_ora() {
		return data_ora;
	}

	public void setData_ora(LocalDateTime data_ora) {
		this.data_ora = data_ora;
	}

	public List<GiocatorePartita> getPartecipazioni() {
		return partecipazioni;
	}

	public void setPartecipazioni(List<GiocatorePartita> partecipazioni) {
		this.partecipazioni = partecipazioni;
	}

}
