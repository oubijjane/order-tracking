package com.verAuto.orderTracking.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.verAuto.orderTracking.enums.CompanyAssignmentType;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String userName;

    @Column(nullable = false)
    private String password;

    @Column
    @Email
    private String email;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonManagedReference(value = "user-userrole")
    @Nullable
    private Set<UserRole> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonManagedReference(value = "user-usercompany")
    @Nullable
    private Set<UserCompany> companies;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at", columnDefinition = "DATETIME(0)")
    private LocalDate createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", columnDefinition = "DATETIME(0)")
    private Date updatedAt;

    @Column
    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "city_id")
    @Nullable
    private City city;

    @Transient
    @JsonProperty("primaryCompanies")
    public List<UserCompany> getPrimaryCompanies() {
        if (this.companies != null) {
            Hibernate.initialize(this.companies);
        }
        if (this.companies == null) return Collections.emptyList();
        return this.companies.stream()
                .filter(c -> c.getType() == CompanyAssignmentType.PRIMARY)
                .collect(Collectors.toList());
    }

    @Transient
    @JsonProperty("auxiliaryCompanies")
    public List<UserCompany> getAuxiliaryCompanies() {
        if (this.companies != null) {
            Hibernate.initialize(this.companies);
        }
        if (this.companies == null) return Collections.emptyList();
        return this.companies.stream()
                .filter(c -> c.getType() == CompanyAssignmentType.AUXILIARY)
                .collect(Collectors.toList());
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return  roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRole().getName())) // Assuming UserRole has getRoleName()
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return userName;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(this.isActive);
    }
}
