package com.hub.arenahub.Model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hub.arenahub.Dto.PartecipantePartita;
import com.hub.arenahub.Dto.RisTorneo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "partite")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Partita {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id_partita;
	private Long id_torneo;
	private Long turno;
	@Column(name = "data")
	private LocalDateTime data_ora;
	private String stato;

	@Transient
	private RisTorneo torneo;
	@Transient
	private List<PartecipantePartita> partecipazioni;

	public Partita() {
	}

	public Long getId_partita() {
		return id_partita;
	}

	public void setId_partita(Long id_partita) {
		this.id_partita = id_partita;
	}

	public Long getId_torneo() {
		return id_torneo;
	}

	public void setId_torneo(Long id_torneo) {
		this.id_torneo = id_torneo;
	}

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

	public String getStato() {
		return stato;
	}

	public void setStato(String stato) {
		this.stato = stato;
	}

	public RisTorneo getTorneo() {
		return torneo;
	}

	public void setTorneo(RisTorneo torneo) {
		this.torneo = torneo;
	}

	public List<PartecipantePartita> getPartecipazioni() {
		return partecipazioni;
	}

	public void setPartecipazioni(List<PartecipantePartita> partecipazioni) {
		this.partecipazioni = partecipazioni;
	}

}
