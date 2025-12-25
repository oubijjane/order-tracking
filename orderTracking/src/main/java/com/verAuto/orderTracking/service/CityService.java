package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.User;

import java.util.List;

public interface CityService {
    List<City> findAll(User user);
    City findCityById(Long id);
    City saveCity(City city);
    void deleteCityById(Long id);
}
