package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CityDAO;
import com.verAuto.orderTracking.entity.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityServiceImpl implements CityService{
    private CityDAO cityDAO;

    @Autowired
    public CityServiceImpl(CityDAO cityDAO) {
        this.cityDAO = cityDAO;
    }
    @Override
    public List<City> findAll() {
        return cityDAO.findAll();
    }

    @Override
    public City findCityById(Long id) {
        return cityDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Did not find city with the id - " + id));
    }

    @Override
    public City saveCity(City city) {
        return cityDAO.save(city);
    }

    @Override
    public void deleteCityById(Long id) {
        boolean exists = cityDAO.existsById(id);

        if(!exists) {
            throw new RuntimeException("city with the id - " + id + " does not exist");
        }
        cityDAO.deleteById(id);
    }
}
