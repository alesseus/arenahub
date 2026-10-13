package com.hub.arenahub.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hub.arenahub.Model.Partecipazione;
import com.hub.arenahub.Model.PartecipazioneId;

public interface PartecipazioniRepo extends JpaRepository<Partecipazione, PartecipazioneId> {

}
