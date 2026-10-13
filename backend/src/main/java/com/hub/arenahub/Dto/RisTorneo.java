package com.hub.arenahub.Dto;

public class RisTorneo {

	private Long id_torneo;
	private String nome;

	public RisTorneo(Long id_torneo, String nome) {
		this.id_torneo = id_torneo;
		this.nome = nome;
	}

	public Long getId_torneo() {
		return id_torneo;
	}

	public String getNome() {
		return nome;
	}

}
