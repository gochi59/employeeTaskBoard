package com.apprasail.beesheet.beesheet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apprasail.beesheet.beesheet.model.Entities.Attributes;

@Repository
public interface AttributeRepo extends JpaRepository<Attributes, Integer> {

}
