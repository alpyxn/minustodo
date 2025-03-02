package com.project.todo_app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;
import java.util.Date;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class TaskRequest {
    private String task;
    private String owner;
    private BigInteger id;
    private int status;
    private Date createdAt;
}
