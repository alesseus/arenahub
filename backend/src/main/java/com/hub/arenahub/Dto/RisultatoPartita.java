package com.hub.arenahub.Dto;

public class RisultatoPartita {

	private String email;
	private Long punteggio;
	private Long posizione;
	private Boolean qualificato;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getPunteggio() {
		return punteggio;
	}

	public void setPunteggio(Long punteggio) {
		this.punteggio = punteggio;
	}

	public Long getPosizione() {
		return posizione;
	}

	public void setPosizione(Long posizione) {
		this.posizione = posizione;
	}

	public Boolean getQualificato() {
		return qualificato;
	}

	public void setQualificato(Boolean qualificato) {
		this.qualificato = qualificato;
	}

}
