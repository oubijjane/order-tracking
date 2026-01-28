package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserDAO extends JpaRepository<User, Integer> {
    @EntityGraph(attributePaths = {"roles", "roles.role"})
    Optional<User> findByUserName(String name);

    @EntityGraph(attributePaths = {"roles", "roles.role", "companies", "companies.company", "city"})
    Optional<User> findDetailedById(Integer id);


    @Query("SELECT u FROM User u " +
            "LEFT JOIN FETCH u.roles " +
            "LEFT JOIN FETCH u.companies " +
            "WHERE u.id = :id")
    Optional<User> findByIdWithCollections(@Param("id") Integer id);




    boolean existsByUserName(String name);
}
