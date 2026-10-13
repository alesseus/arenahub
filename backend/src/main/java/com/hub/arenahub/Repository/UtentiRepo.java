package com.hub.arenahub.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hub.arenahub.Model.Utente;

public interface UtentiRepo extends JpaRepository<Utente, String> {

}
