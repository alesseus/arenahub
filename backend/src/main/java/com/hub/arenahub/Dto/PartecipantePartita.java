package com.hub.arenahub.Dto;

public class PartecipantePartita {

	private String email;
	private String nome;
	private String cognome;
	private Long punteggio;
	private Long posizione;
	private boolean qualificato;

	public PartecipantePartita(String email, String nome, String cognome, Long punteggio, Long posizione,
			boolean qualificato) {
		this.email = email;
		this.nome = nome;
		this.cognome = cognome;
		this.punteggio = punteggio;
		this.posizione = posizione;
		this.qualificato = qualificato;
	}

	public String getEmail() {
		return email;
	}

	public String getNome() {
		return nome;
	}

	public String getCognome() {
		return cognome;
	}

	public Long getPunteggio() {
		return punteggio;
	}

	public Long getPosizione() {
		return posizione;
	}

	public boolean isQualificato() {
		return qualificato;
	}

}
