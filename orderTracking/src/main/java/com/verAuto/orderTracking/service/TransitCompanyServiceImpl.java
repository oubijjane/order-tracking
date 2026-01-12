package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.TransitCompanyDTO;
import com.verAuto.orderTracking.dao.TransitCompanyDAO;
import com.verAuto.orderTracking.entity.TransitCompany;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TransitCompanyServiceImpl implements TransitCompanyService{

    private final TransitCompanyDAO transitCompanyDAO;

    @Autowired
    public TransitCompanyServiceImpl(TransitCompanyDAO transitCompanyDAO) {
        this.transitCompanyDAO = transitCompanyDAO;
    }


    @Override
    public List<TransitCompany> findAllTransitCompany() {
        return transitCompanyDAO.findAll();
    }

    @Override
    public TransitCompany findTransitCompanyById(long id) {
        return transitCompanyDAO.findById(id)
                .orElseThrow(() ->  new RuntimeException("could not find transit company by id- " + id));
    }

    @Override
    public TransitCompany saveNewTransitCompany(TransitCompanyDTO newTransit) {
        String newTransitName = newTransit.getName().trim();
        if(transitCompanyDAO.existsByName(newTransitName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le transport existe déjà");
        }
        TransitCompany transitCompany = new TransitCompany();
        transitCompany.setId(null);
        transitCompany.setName(newTransitName);
        return transitCompanyDAO.save(transitCompany);
    }

    @Override
    public TransitCompany updateTransitCompany(long id, TransitCompanyDTO transitCompanyDTO) {
        String newTransitName = transitCompanyDTO.getName().trim();
        TransitCompany existingCompany = findTransitCompanyById(id);
        if(transitCompanyDAO.existsByName(newTransitName) && !existingCompany.getName().equals(newTransitName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le transport existe déjà");
        }

        existingCompany.setName(newTransitName);
        return transitCompanyDAO.save(existingCompany);
    }

    @Override
    public void deleteTransitCompany(long id) {
        boolean exist = transitCompanyDAO.existsById(id);
        if(!exist) {
            throw new RuntimeException("transit company with ID " + id + " does not exist");
        }
        transitCompanyDAO.deleteById(id);
    }
}
