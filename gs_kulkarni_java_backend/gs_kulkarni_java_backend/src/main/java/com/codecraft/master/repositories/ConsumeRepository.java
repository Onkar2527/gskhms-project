package com.codecraft.master.repositories;

import com.codecraft.master.entities.Consume;
import com.codecraft.master.entities.Doses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsumeRepository extends JpaRepository<Consume, Integer> {
}