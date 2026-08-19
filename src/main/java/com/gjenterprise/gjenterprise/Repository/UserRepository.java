package com.gjenterprise.gjenterprise.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gjenterprise.gjenterprise.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}