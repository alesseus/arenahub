package com.hub.arenahub.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hub.arenahub.Model.Iscrizione;
import com.hub.arenahub.Model.IscrizioneId;

public interface IscrizioniRepo extends JpaRepository<Iscrizione, IscrizioneId> {

}
