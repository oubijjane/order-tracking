package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.WindowBrandDTO;
import com.verAuto.orderTracking.entity.WindowBrand;

import java.util.List;

public interface WindowBrandService {
    List<WindowBrandDTO> getAllWindowBrand();
    WindowBrand findWindowBrandById(Long id);
    WindowBrand addNewBrand(WindowBrandDTO windowBrandDTO);
    WindowBrand updateWindowBrand(Long id, WindowBrandDTO windowBrandDTO);
    void DeleteWindowBrand(Long ID);

}
