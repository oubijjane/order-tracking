package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.ModelDTO;
import com.verAuto.orderTracking.dao.CarModelDAO;
import com.verAuto.orderTracking.entity.CarBrand;
import com.verAuto.orderTracking.entity.CarModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CarModelServiceImpl implements CarModelService{

    private final CarModelDAO carModelDAO;
    private final CarBrandService carBrandService;

    @Autowired
    public CarModelServiceImpl(CarModelDAO carModelDAO, CarBrandService carBrandService) {
        this.carModelDAO = carModelDAO;
        this.carBrandService = carBrandService;
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
    public CarModel save(ModelDTO modelDTO) {

        String updatedName = modelDTO.getModel().trim();
        if (carModelDAO.existsByModel(modelDTO.getModel().trim())) {
            // Throw a custom exception or a built-in one
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le model existe déjà");
        }
        CarModel carModel = new CarModel();
        CarBrand carBrand = carBrandService.findById(modelDTO.getBrandId());
        carModel.setModel(modelDTO.getModel().trim());
        carModel.setCarBrand(carBrand);
        return carModelDAO.save(carModel);
    }

    @Override
    public CarModel updateCarModel(long id, ModelDTO modelDTO) {
        CarBrand carBrand = carBrandService.findById(modelDTO.getBrandId());
        CarModel model = findById(id);
        if (carModelDAO.existsByModel(modelDTO.getModel().trim()) && !model.getModel().equals(modelDTO.getModel().trim())) {
            // Throw a custom exception or a built-in one
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le model existe déjà");
        }
        model.setModel(modelDTO.getModel().trim());
        model.setCarBrand(carBrand);

        return carModelDAO.save(model);
    }

    @Override
    public void deleteById(Long id) {
        boolean exists = carModelDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("car model with ID " + id + " does not exist");
        }

        carModelDAO.deleteById(id);
    }

    @Override
    public Page<CarModel> findAllModel(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("model").ascending());
        return carModelDAO.findAll(pageable);
    }
}
