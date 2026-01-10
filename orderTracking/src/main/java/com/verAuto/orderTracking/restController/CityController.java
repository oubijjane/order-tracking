package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.CityDTO;
import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<List<City>> getAllCities(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(cityService.findAll(user), HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {

        return new ResponseEntity<>(cityService.findCityById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<City> createCity(@RequestBody CityDTO city) {
        return new ResponseEntity<>(cityService.saveNewCity(city), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable Long id, @RequestBody CityDTO city) {
        return new ResponseEntity<>(cityService.UpdateCity(id,city), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCityById(@PathVariable Long id) {
        cityService.deleteCityById(id);

        return new ResponseEntity<>("the city id " + id + " has successfully deleted", HttpStatus.NO_CONTENT);
    }
}
