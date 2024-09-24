package com.apprasail.beesheet.beesheet.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.AttributeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Attributes;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AttributeService {

    private final AttributeRepo attributeRepo;

    public AttributeService(AttributeRepo attributeRepo) {
        this.attributeRepo = attributeRepo;
    }

    public void addAttribute(Attributes attributeInput) {
        Attributes attribute=attributeRepo.findByTitle(attributeInput.getTitle());
        log.info("New attribute added: "+attributeInput.getTitle());
        if(attribute!=null)
            throw new IllegalArgumentException("Attribute with this name already exists");
        attributeRepo.save(attributeInput);
    }

    public List<Attributes> getAll() {
        log.info("All attributes fetched");
        return attributeRepo.findAll();
    }
    
}
