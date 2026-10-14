package com.hub.arenahub.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "impostazioni")
public class Impostazioni {

	@Id
	@JsonIgnore
	private Short id;
	private Integer max_tornei_utente;

	public Impostazioni() {
	}

	public Short getId() {
		return id;
	}

	public void setId(Short id) {
		this.id = id;
	}

	public Integer getMax_tornei_utente() {
		return max_tornei_utente;
	}

	public void setMax_tornei_utente(Integer max_tornei_utente) {
		this.max_tornei_utente = max_tornei_utente;
	}

}
