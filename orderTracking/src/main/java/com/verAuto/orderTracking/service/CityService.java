package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.City;

import java.util.List;

public interface CityService {
    List<City> findAll();
    City findCityById(Long id);
    City saveCity(City city);
    void deleteCityById(Long id);
}
