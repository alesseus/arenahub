package com.hub.arenahub.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hub.arenahub.Model.Gioco;
import com.hub.arenahub.Repository.GiochiRepo;

@Service
public class GiochiSrv {

	@Autowired
	private GiochiRepo giochiRepo;

	public List<Gioco> getAllGiochi() {
		return giochiRepo.findAll();
	}

}
