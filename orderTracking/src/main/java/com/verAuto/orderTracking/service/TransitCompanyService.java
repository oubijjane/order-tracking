package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.TransitCompanyDTO;
import com.verAuto.orderTracking.entity.TransitCompany;

import java.util.List;

public interface TransitCompanyService {
    List<TransitCompany> findAllTransitCompany();
    TransitCompany findTransitCompanyById(long id);
    TransitCompany saveNewTransitCompany(TransitCompanyDTO newTransit);
    TransitCompany updateTransitCompany(long id, TransitCompanyDTO transitCompanyDTO);
    void deleteTransitCompany(long id);
}
