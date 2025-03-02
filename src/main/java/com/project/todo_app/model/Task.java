package com.project.todo_app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigInteger;
import java.util.Date;

@Entity
@Table(name = "Task")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private BigInteger id;

    @Column(name = "task", nullable = false)
    private String task;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "owner", nullable = false)
    private String owner;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Date createdAt;
}
