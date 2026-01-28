package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CreateUserRole;
import com.verAuto.orderTracking.DTO.CreateUserCompany;
import com.verAuto.orderTracking.DTO.UserDTO;
import com.verAuto.orderTracking.dao.CompanyDAO;
import com.verAuto.orderTracking.dao.UserCompanyDAO;
import com.verAuto.orderTracking.dao.UserDAO;
import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserCompany;
import com.verAuto.orderTracking.enums.CompanyAssignmentType;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService{
    private final UserDAO userDAO;
    private final UserRoleService userRoleService;
    private final CompanyDAO companyDAO;
    private final UserCompanyService userCompanyService;
    private final CityService cityService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserDAO userDAO, UserRoleService userRoleService, CompanyDAO companyDAO, UserCompanyService userCompanyService, UserCompanyDAO userCompanyDAO, CityService cityService, BCryptPasswordEncoder passwordEncoder) {
        this.userRoleService = userRoleService;
        this.companyDAO = companyDAO;
        this.userDAO = userDAO;
        this.userCompanyService = userCompanyService;
        this.cityService = cityService;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public List<User> findAll() {
        return userDAO.findAll();
    }

    @Override
    @Transactional
    public UserDTO findById(int id) {
        User user = userDAO.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("could not find user with ths id - " + id));
        UserDTO userDTO = new UserDTO();

        
        userDTO.setCityId(user.getCity().getId());
        userDTO.setUsername(user.getUsername());
        if(user.getEmail() != null) {
            userDTO.setEmail(user.getEmail());
        }
        List<Long> pCompanies = user.getPrimaryCompanies()
                .stream()
                .map(company -> company.getCompany().getId())
                .collect(Collectors.toCollection(ArrayList::new));
        userDTO.setCompanies(pCompanies);
        List<Long> sCompanies = user.getAuxiliaryCompanies()
                .stream()
                .map(company -> company.getCompany().getId())
                .collect(Collectors.toCollection(ArrayList::new));
        userDTO.setSecondaryCompanies(sCompanies);
        userDTO.setRoles(user.getRoles().stream().map(role->role.getRole().getId()).toList());
        return userDTO;
    }
    @Override
    public User findUserByName(String name) {
        return userDAO.findByUserName(name)
                .orElseThrow(() -> new UsernameNotFoundException("User not found after auth"));
    }

    @Override
    public List<Company> getUserCompany(int id) {

        return companyDAO.findAllByUserId(id);
    }

    @Override
    public User saveNewUser(UserDTO user) {
        User newUser = new User();
        if (userDAO.existsByUserName(user.getUsername())) {
            // Throw a custom exception or a built-in one
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom d'utilisateur existe déjà");
        }
        newUser.setUserName(user.getUsername());
        newUser.setCity(cityService.findCityById(user.getCityId()));
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDAO.save(newUser);
    }

    @Override
    public User updateUser(int id, UserDTO userDto) {

        User existingUser = userDAO.findById(id).orElseThrow(() -> new RuntimeException("could not find user with ths id - " + id));


        if (userDAO.existsByUserName(userDto.getUsername()) && !existingUser.getUsername().equals(userDto.getUsername())) {
            // Throw a custom exception or a built-in one
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom d'utilisateur existe déjà");
        }
        // 2. Update basic fields
        if(userDto.getUsername() != null && !userDto.getUsername().isEmpty()) {
            existingUser.setUserName(userDto.getUsername());
        }
            existingUser.setEmail(userDto.getEmail());
        existingUser.setIsActive(userDto.isStatus());

        // 3. Update Password ONLY if it was provided (not empty)
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        // 4. Update City
        if(userDto.getCityId() != 0 && cityService.findCityById( userDto.getCityId()) != null) {
        City city = cityService.findCityById( userDto.getCityId());
        existingUser.setCity(city);
        }

        // 5. Update Relationships (Roles/Companies)
        // Note: This usually involves clearing the old set and adding new ones
        // depending on how your UserRole/UserCompany junction entities are structured.
        userRoleService.deleteByUserId(id);
        assert existingUser.getRoles() != null;
        existingUser.getRoles().clear();


// 2. Only add new ones if the list actually has items
        if (userDto.getRoles() != null && !userDto.getRoles().isEmpty()) {
            userDto.getRoles().forEach((role) -> {
                CreateUserRole request = new CreateUserRole(); // New instance per loop is safer
                request.setUserId(id);
                request.setRoleId(role);
                userRoleService.saveUserRole(request);
            });
        }

        userCompanyService.deleteByUserId(id);
        assert existingUser.getCompanies() != null;
        existingUser.getCompanies().clear();
        userDAO.saveAndFlush(existingUser);
        Set<Long> primaryIds = new HashSet<>();
        List<CreateUserCompany> requests = new ArrayList<>();
        if(userDto.getCompanies() != null && !userDto.getCompanies().isEmpty()) {
            userDto.getCompanies().forEach((company -> {
                primaryIds.add(company);
                CreateUserCompany request = new CreateUserCompany();
                request.setCompanyId(company);
                request.setUserId(id);
                request.setType(CompanyAssignmentType.PRIMARY);
                requests.add(request);
            }));
        }
        if(userDto.getSecondaryCompanies() != null && !userDto.getSecondaryCompanies().isEmpty()) {
            userDto.getSecondaryCompanies().forEach((company -> {
                CreateUserCompany request = new CreateUserCompany();
                if (primaryIds.contains(company)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "companie est déjà utilisée comme assurance principale.");
                }
                request.setCompanyId(company);
                request.setUserId(id);
                request.setType(CompanyAssignmentType.AUXILIARY);
                requests.add(request);
            }));
        }
        requests.forEach(userCompanyService::saveNewUserCompany);
        LocalDateTime now = LocalDateTime.now();
        Date out = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        existingUser.setUpdatedAt(out);

        return userDAO.save(existingUser);
    }

    @Override
    public void deleteUserById(int id) {
        boolean exists = userDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("user with ID " + id + " does not exist");
        }
        userDAO.deleteById(id);
    }
}
