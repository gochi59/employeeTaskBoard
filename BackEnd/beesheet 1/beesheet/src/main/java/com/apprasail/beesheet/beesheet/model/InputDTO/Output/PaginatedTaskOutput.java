package com.apprasail.beesheet.beesheet.model.InputDTO.Output;

import java.util.List;

import lombok.Data;

@Data
public class PaginatedTaskOutput {

    private List<TaskOutput>taskOutputs;
    private int pageNumber;
}
