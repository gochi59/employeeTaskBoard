package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import lombok.Data;

@Data
public class TokenOutput {

    private String jwtToken;
    private String refreshToken;

}
