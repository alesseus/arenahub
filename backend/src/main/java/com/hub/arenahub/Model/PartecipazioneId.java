package com.hub.arenahub.Model;

import java.io.Serializable;
import java.util.Objects;

public class PartecipazioneId implements Serializable {

	private Long id_partita;
	private String email;

	public PartecipazioneId() {
	}

	public PartecipazioneId(Long id_partita, String email) {
		this.id_partita = id_partita;
		this.email = email;
	}

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof PartecipazioneId altro)) {
			return false;
		}
		return Objects.equals(id_partita, altro.id_partita) && Objects.equals(email, altro.email);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id_partita, email);
	}

}
