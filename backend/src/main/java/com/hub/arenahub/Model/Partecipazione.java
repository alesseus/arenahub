package com.hub.arenahub.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "partecipazioni")
@IdClass(PartecipazioneId.class)
public class Partecipazione {

	@Id
	private Long id_partita;
	@Id
	private String email;
	private Long id_torneo;
	private Long punteggio;
	private Long posizione;
	private boolean qualificato;

	public Partecipazione() {
	}

	public Long getId_partita() {
		return id_partita;
	}

	public void setId_partita(Long id_partita) {
		this.id_partita = id_partita;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getId_torneo() {
		return id_torneo;
	}

	public void setId_torneo(Long id_torneo) {
		this.id_torneo = id_torneo;
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

	public boolean isQualificato() {
		return qualificato;
	}

	public void setQualificato(boolean qualificato) {
		this.qualificato = qualificato;
	}

}
