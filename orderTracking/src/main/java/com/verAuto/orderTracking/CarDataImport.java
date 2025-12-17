package com.verAuto.orderTracking;

import java.util.List;

public class CarDataImport {
    private String brand;
    private List<String> models;

    // Getters and Setters needed for Jackson
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public List<String> getModels() { return models; }
    public void setModels(List<String> models) { this.models = models; }
}
