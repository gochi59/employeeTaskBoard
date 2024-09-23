package com.apprasail.beesheet.beesheet.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.apprasail.beesheet.beesheet.Repository.TemporaryUserRepo;
import com.apprasail.beesheet.beesheet.model.Entities.TemporaryUser;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TemporaryUserService {

    private final TemporaryUserRepo temporaryUserRepo;
    public TemporaryUserService(TemporaryUserRepo temporaryUserRepo)
    {
        this.temporaryUserRepo=temporaryUserRepo;
    }
    public List<TemporaryUser> findAll() {
        log.info("All temporary users fetched");
        return temporaryUserRepo.findAll();
    }

}
