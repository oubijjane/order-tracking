package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {
    private CityService cityService;

    @Autowired
    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        return new ResponseEntity<>(cityService.findAll(), HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {

        return new ResponseEntity<>(cityService.findCityById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<City> createCity(@RequestBody City city) {
        city.setId(null);

        City addedCity = cityService.saveCity(city);

        return new ResponseEntity<>(addedCity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable Long id, @RequestBody City city) {
        City updatedCity = cityService.findCityById(id);
        updatedCity.setCityName(city.getCityName());
        City savedCity = cityService.saveCity(updatedCity);

        return new ResponseEntity<>(savedCity, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCityById(@PathVariable Long id) {
        cityService.deleteCityById(id);

        return new ResponseEntity<>("the city id " + id + " has successfully deleted", HttpStatus.NO_CONTENT);
    }
}
