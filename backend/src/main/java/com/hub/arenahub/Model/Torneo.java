package com.hub.arenahub.Model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hub.arenahub.Dto.MioStato;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "tornei")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Torneo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id_torneo;
	private String nome;
	private String descrizione;
	private Long id_gioco;
	@Column(name = "data_inizio")
	private LocalDateTime data_ora_inizio;
	@Column(name = "data_fine")
	private LocalDateTime data_ora_fine;
	@Column(name = "posti")
	private Integer posti_max;
	private String stato;

	@Transient
	private Gioco gioco;
	@Transient
	private Integer iscritti;
	@Transient
	private Integer posti_liberi;
	@Transient
	private Integer in_attesa;
	@Transient
	private MioStato mio_stato;

	public Torneo() {
	}

	public Long getId_torneo() {
		return id_torneo;
	}

	public void setId_torneo(Long id_torneo) {
		this.id_torneo = id_torneo;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	public Long getId_gioco() {
		return id_gioco;
	}

	public void setId_gioco(Long id_gioco) {
		this.id_gioco = id_gioco;
	}

	public LocalDateTime getData_ora_inizio() {
		return data_ora_inizio;
	}

	public void setData_ora_inizio(LocalDateTime data_ora_inizio) {
		this.data_ora_inizio = data_ora_inizio;
	}

	public LocalDateTime getData_ora_fine() {
		return data_ora_fine;
	}

	public void setData_ora_fine(LocalDateTime data_ora_fine) {
		this.data_ora_fine = data_ora_fine;
	}

	public Integer getPosti_max() {
		return posti_max;
	}

	public void setPosti_max(Integer posti_max) {
		this.posti_max = posti_max;
	}

	public String getStato() {
		return stato;
	}

	public void setStato(String stato) {
		this.stato = stato;
	}

	public Gioco getGioco() {
		return gioco;
	}

	public void setGioco(Gioco gioco) {
		this.gioco = gioco;
	}

	public Integer getIscritti() {
		return iscritti;
	}

	public void setIscritti(Integer iscritti) {
		this.iscritti = iscritti;
	}

	public Integer getPosti_liberi() {
		return posti_liberi;
	}

	public void setPosti_liberi(Integer posti_liberi) {
		this.posti_liberi = posti_liberi;
	}

	public Integer getIn_attesa() {
		return in_attesa;
	}

	public void setIn_attesa(Integer in_attesa) {
		this.in_attesa = in_attesa;
	}

	public MioStato getMio_stato() {
		return mio_stato;
	}

	public void setMio_stato(MioStato mio_stato) {
		this.mio_stato = mio_stato;
	}

}
