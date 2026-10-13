package com.hub.arenahub.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "giochi")
public class Gioco {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id_gioco;
	private String nome;
	private String path_foto;

	public Gioco() {
	}

	public String getPath_foto() {
		return path_foto;
	}

	public void setPath_foto(String path_foto) {
		this.path_foto = path_foto;
	}

	public Long getId_gioco() {
		return id_gioco;
	}

	public void setId_gioco(Long id_gioco) {
		this.id_gioco = id_gioco;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

}
