package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CarBrandDAO;
import com.verAuto.orderTracking.entity.CarBrand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarBrandServiceImpl implements CarBrandService{

    private CarBrandDAO carBrandDAO;

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
    public CarBrand save(CarBrand carBrand) {
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
