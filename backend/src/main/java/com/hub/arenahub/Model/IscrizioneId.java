package com.hub.arenahub.Model;

import java.io.Serializable;
import java.util.Objects;

public class IscrizioneId implements Serializable {

	private Long id_torneo;
	private String email;

	public IscrizioneId() {
	}

	public IscrizioneId(Long id_torneo, String email) {
		this.id_torneo = id_torneo;
		this.email = email;
	}

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof IscrizioneId altro)) {
			return false;
		}
		return Objects.equals(id_torneo, altro.id_torneo) && Objects.equals(email, altro.email);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id_torneo, email);
	}

}
