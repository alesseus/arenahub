package com.hub.arenahub.Dto;

public class Classifica {

	private int posizione;
	private String email;
	private String nome;
	private String cognome;
	private long punteggio;

	public Classifica(String email, String nome, String cognome, long punteggio) {
		this.email = email;
		this.nome = nome;
		this.cognome = cognome;
		this.punteggio = punteggio;
	}

	public int getPosizione() {
		return posizione;
	}

	public void setPosizione(int posizione) {
		this.posizione = posizione;
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

	public long getPunteggio() {
		return punteggio;
	}

}
