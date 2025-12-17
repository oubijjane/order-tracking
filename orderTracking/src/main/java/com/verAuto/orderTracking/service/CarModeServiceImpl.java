package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CarModelDAO;
import com.verAuto.orderTracking.entity.CarModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarModeServiceImpl implements CarModelService{

    private CarModelDAO carModelDAO;

    @Autowired
    public CarModeServiceImpl(CarModelDAO carModelDAO) {
        this.carModelDAO = carModelDAO;
    }
    @Override
    public List<CarModel> findAll() {
        return carModelDAO.findAll();
    }

    @Override
    public CarModel findById(Long id) {
        return carModelDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Did not find car model with the id - " + id));
    }

    @Override
    public List<CarModel> findByCarBrandId(Long brandId) {
        List<CarModel> brandModels = carModelDAO.findByCarBrandId(brandId);

        if(brandModels.isEmpty()) {
            throw new RuntimeException("Did not find orders for registrationNumber: " + brandId);
        }
        return carModelDAO.findByCarBrandId(brandId);
    }

    @Override
    public CarModel save(CarModel CarModel) {
        return carModelDAO.save(CarModel);
    }

    @Override
    public void deleteById(Long id) {
        boolean exists = carModelDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("car model with ID " + id + " does not exist");
        }

        carModelDAO.deleteById(id);
    }
}
