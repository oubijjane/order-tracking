package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserRole;
import com.verAuto.orderTracking.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRoleDOA extends JpaRepository<UserRole, UserRoleId> {

    @Query("""
        select ur.user
        from UserRole ur
        where ur.role.name = :roleName
    """)
    List<User> findUsersByRoleName(@Param("roleName") String roleName);

    List<UserRole> findByIdRoleId(int roleId);
    List<UserRole> findByIdUserId(int userId);
}
