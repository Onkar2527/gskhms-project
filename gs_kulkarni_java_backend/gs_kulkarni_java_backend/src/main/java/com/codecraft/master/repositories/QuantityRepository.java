package com.codecraft.master.repositories;

import com.codecraft.master.entities.Quantity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface QuantityRepository extends JpaRepository<Quantity, Integer> {
}