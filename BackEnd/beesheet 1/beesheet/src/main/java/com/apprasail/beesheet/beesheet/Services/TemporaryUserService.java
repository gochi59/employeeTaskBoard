package com.apprasail.beesheet.beesheet.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.TemporaryUserRepo;
import com.apprasail.beesheet.beesheet.model.Entities.TemporaryUser;

@Service
public class TemporaryUserService {

    private final TemporaryUserRepo temporaryUserRepo;
    public TemporaryUserService(TemporaryUserRepo temporaryUserRepo)
    {
        this.temporaryUserRepo=temporaryUserRepo;
    }
    public List<TemporaryUser> findAll() {
        return temporaryUserRepo.findAll();
    }

}
