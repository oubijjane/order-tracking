package com.verAuto.orderTracking;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.verAuto.orderTracking.CarDataImport;
import com.verAuto.orderTracking.dao.CarBrandDAO;
import com.verAuto.orderTracking.dao.CarModelDAO;
import com.verAuto.orderTracking.dao.UserDAO;
import com.verAuto.orderTracking.entity.CarBrand;
import com.verAuto.orderTracking.entity.CarModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
// ... other imports

@Component
public class DatabaseLoader implements CommandLineRunner {


    private final CarBrandDAO brandRepository;
    private final CarModelDAO modelRepository;


    @Autowired
    public DatabaseLoader(CarBrandDAO brandRepository, CarModelDAO modelRepository) {
        this.brandRepository = brandRepository;
        this.modelRepository = modelRepository;

    }

    @Override
    public void run(String... args) {
        if (brandRepository.count() == 0) {
            try (InputStream inputStream = DatabaseLoader.class.getResourceAsStream("/cars.json")) {
                // 1. Read JSON file (safe handling)
                if (inputStream == null) {
                    System.out.println("❌ Resource '/cars.json' not found on classpath.");
                    return;
                }
                ObjectMapper mapper = new ObjectMapper();
                List<CarDataImport> cars = mapper.readValue(inputStream, new TypeReference<List<CarDataImport>>(){});

                // 2. Loop and Save
                for (CarDataImport carData : cars) {
                    // Create Brand
                    CarBrand brand = new CarBrand();
                    brand.setBrand(carData.getBrand());
                    brandRepository.save(brand);

                    // Create Models for that Brand
                    for (String modelName : carData.getModels()) {
                        CarModel model = new CarModel();
                        model.setModel(modelName);
                        model.setCarBrand(brand);
                        modelRepository.save(model);
                    }
                }
                System.out.println("✅ Database populated with Moroccan Car List!");

            } catch (IOException e) {
                System.out.println("❌ Unable to save cars: " + e.getMessage());
            }
        }
    }
}