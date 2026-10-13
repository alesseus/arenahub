package com.hub.arenahub.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hub.arenahub.Model.Gioco;
import com.hub.arenahub.Services.GiochiSrv;

@RestController
@RequestMapping("/api/giochi")
public class GiocoController {

	@Autowired
	private GiochiSrv giochiSrv;

	@GetMapping
	public List<Gioco> elencoGiochi() {
		return giochiSrv.getAllGiochi();
	}

}
