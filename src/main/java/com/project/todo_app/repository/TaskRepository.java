package com.project.todo_app.repository;

import com.project.todo_app.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, BigInteger> {
    List<Task> findByOwner(String owner);

    void deleteByOwner(String owner);

    Task findTaskByTask(String task);

    Task findTaskownerById(BigInteger id);




    




}
