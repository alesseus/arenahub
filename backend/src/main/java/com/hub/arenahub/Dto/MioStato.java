package com.hub.arenahub.Dto;

public class MioStato {

	private boolean iscritto;
	private boolean attesa;
	private Integer posizione_attesa;

	public MioStato(boolean iscritto, boolean attesa, Integer posizione_attesa) {
		this.iscritto = iscritto;
		this.attesa = attesa;
		this.posizione_attesa = posizione_attesa;
	}

	public boolean isIscritto() {
		return iscritto;
	}

	public boolean isAttesa() {
		return attesa;
	}

	public Integer getPosizione_attesa() {
		return posizione_attesa;
	}

}
