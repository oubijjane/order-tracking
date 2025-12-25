package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CityDAO;
import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CityServiceImpl implements CityService{
    private CityDAO cityDAO;

    @Autowired
    public CityServiceImpl(CityDAO cityDAO) {
        this.cityDAO = cityDAO;
    }

    @Override
    public List<City> findAll(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());

        // Rule 1: Garagiste (City-based)
        if (roleNames.contains("ROLE_GARAGISTE")) {
            City userCity = user.getCity();
            if (userCity != null) {
                return List.of(userCity); // Wrap the single city in a list
            } else {
                return Collections.emptyList();
            }
        }
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
