package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.BrandDTO;
import com.verAuto.orderTracking.dao.CarBrandDAO;
import com.verAuto.orderTracking.entity.CarBrand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CarBrandServiceImpl implements CarBrandService{

    private final CarBrandDAO carBrandDAO;

    @Autowired
    public CarBrandServiceImpl(CarBrandDAO carBrandDAO) {
        this.carBrandDAO = carBrandDAO;

    }
    @Override
    public List<CarBrand> findAll() {
        return carBrandDAO.findAll();
    }

    @Override
    public CarBrand findById(Long id) {
        return carBrandDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Did not find brand id - " + id));
    }

    @Override
    public CarBrand saveNewBrand(BrandDTO brandDTO) {
        CarBrand carBrand = new CarBrand();
        String newBrand = brandDTO.getBrand().trim();
        if(carBrandDAO.existsByBrand(newBrand)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La marque existe déjà");
        }
        carBrand.setBrand(newBrand);
        return carBrandDAO.save(carBrand);
    }

    @Override
    public CarBrand updateBrand(long id, BrandDTO brandDTO) {
        CarBrand carBrand = findById(id);
        String newBrand = brandDTO.getBrand().trim();
        if(carBrandDAO.existsByBrand(newBrand) && !carBrand.getBrand().equals(newBrand)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La marque existe déjà");
        }
        carBrand.setBrand(newBrand);
        return carBrandDAO.save(carBrand);
    }

    @Override
    public void deleteById(Long id) {
        boolean exists = carBrandDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("brand with ID " + id + " does not exist");
        }
        carBrandDAO.deleteById(id);
    }
}
