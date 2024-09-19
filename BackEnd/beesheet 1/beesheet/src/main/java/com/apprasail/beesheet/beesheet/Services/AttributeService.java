package com.apprasail.beesheet.beesheet.Services;

import org.springframework.stereotype.Service;

import java.util.List;
import com.apprasail.beesheet.beesheet.Repository.AttributeRepo;
import com.apprasail.beesheet.beesheet.model.Entities.Attributes;
import com.apprasail.beesheet.beesheet.model.InputDTO.Input.AttributeInput;

import aj.org.objectweb.asm.Attribute;

@Service
public class AttributeService {

    private final AttributeRepo attributeRepo;

    public AttributeService(AttributeRepo attributeRepo) {
        this.attributeRepo = attributeRepo;
    }

    public void addAttribute(Attributes attributeInput) {
        Attributes attribute=attributeRepo.findByTitle(attributeInput.getTitle());
        // System.out.println(attribute);
        if(attribute!=null)
            throw new IllegalArgumentException("Attribute with this name already exists");
        attributeRepo.save(attributeInput);
    }

    public List<Attributes> getAll() {
        return attributeRepo.findAll();
    }
    
}
