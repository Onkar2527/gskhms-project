package com.codecraft.master.repositories;

import com.codecraft.master.entities.Units;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UnitsRepository extends JpaRepository<Units, Integer> {
}