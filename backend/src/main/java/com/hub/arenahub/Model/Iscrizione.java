package com.hub.arenahub.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "iscrizioni")
@IdClass(IscrizioneId.class)
public class Iscrizione {

	@Id
	private Long id_torneo;
	@Id
	private String email;
	@Column(name = "data_isc")
	private LocalDateTime data_iscrizione;
	private boolean attesa;

	@Transient
	private Integer posizione_attesa;

	public Iscrizione() {
	}

	public Long getId_torneo() {
		return id_torneo;
	}

	public void setId_torneo(Long id_torneo) {
		this.id_torneo = id_torneo;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public LocalDateTime getData_iscrizione() {
		return data_iscrizione;
	}

	public void setData_iscrizione(LocalDateTime data_iscrizione) {
		this.data_iscrizione = data_iscrizione;
	}

	public boolean isAttesa() {
		return attesa;
	}

	public void setAttesa(boolean attesa) {
		this.attesa = attesa;
	}

	public Integer getPosizione_attesa() {
		return posizione_attesa;
	}

	public void setPosizione_attesa(Integer posizione_attesa) {
		this.posizione_attesa = posizione_attesa;
	}

}
