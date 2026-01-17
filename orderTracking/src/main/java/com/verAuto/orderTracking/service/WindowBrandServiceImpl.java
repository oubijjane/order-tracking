package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.WindowBrandDTO;
import com.verAuto.orderTracking.DTO.WindowDetailsDTO;
import com.verAuto.orderTracking.dao.WindowBrandDAO;
import com.verAuto.orderTracking.entity.WindowBrand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WindowBrandServiceImpl implements WindowBrandService{

    private final WindowBrandDAO windowBrandDAO;

    @Autowired
    public WindowBrandServiceImpl(WindowBrandDAO windowBrandDAO) {
        this.windowBrandDAO = windowBrandDAO;
    }

    @Override
    public List<WindowBrandDTO> getAllWindowBrand() {
        return windowBrandDAO.findAll()
                .stream()
                .map(windowBrand -> {
                                WindowBrandDTO  dto = new WindowBrandDTO();
                                dto.setWindowBrand(windowBrand.getWindowBrand());
                                dto.setId(windowBrand.getId());
                                return dto;
                     })
                .collect(Collectors.toList());
    }

    @Override
    public WindowBrand findWindowBrandById(Long id) {
        return windowBrandDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("can't find window brand with the id: " + id));
    }

    @Override
    public WindowBrand addNewBrand(WindowBrandDTO windowBrand) {
        WindowBrand newWindowBrand = new WindowBrand();
        newWindowBrand.setWindowBrand(windowBrand.getWindowBrand());
        return windowBrandDAO.save(newWindowBrand);
    }

    @Override
    public WindowBrand updateWindowBrand(Long id, WindowBrandDTO windowBrandDTO) {
    WindowBrand existingWindowBrand = findWindowBrandById(id);
        existingWindowBrand.setWindowBrand(windowBrandDTO.getWindowBrand());
        return windowBrandDAO.save(existingWindowBrand);
    }

    @Override
    public void DeleteWindowBrand(Long id) {
        windowBrandDAO.deleteById(id);
    }
}
