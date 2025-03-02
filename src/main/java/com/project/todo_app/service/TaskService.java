package com.project.todo_app.service;

import com.project.todo_app.model.Task;
import com.project.todo_app.model.TaskRequest;
import com.project.todo_app.model.TaskResponse;
import com.project.todo_app.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    public Task addTask(String taskTitle,String owner) {
        Task task = Task.builder().task(taskTitle).build();
        task.setOwner(owner);
        task.setStatus(0);
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<TaskRequest> getTasksByOwner(String owner){
        List<Task> tasks = taskRepository.findByOwner(owner);
        List<TaskRequest> taskRequests = new ArrayList<>();

        tasks.forEach(
                task->{
                    taskRequests.add(
                            TaskRequest.builder()
                                    .task(task.getTask())
                                    .id(task.getId())
                                    .status(task.getStatus())
                                    .owner(task.getOwner())
                                    .createdAt(task.getCreatedAt())
                                    .build()

                    );
                }
        );
        return taskRequests;
    }


    @Transactional
    public List<TaskRequest> deleteTaskByOwner(String owner){
        taskRepository.deleteByOwner(owner);
        return getTasksByOwner(owner);
    }

    @Transactional
    public BigInteger deleteTaskById(BigInteger id){
        Task task = taskRepository.findById(id).orElseThrow();
        taskRepository.deleteById(task.getId());
        return id;
    }

    public List<TaskRequest> getTasksByTask(String task,String owner) {
        List<TaskRequest> taskRequests = getTasksByOwner(owner);

        List<TaskRequest> filteredTasks = new ArrayList<>();

        filteredTasks = taskRequests.stream().filter(
                taskRequest -> taskRequest.getTask().toLowerCase().contains(task.toLowerCase())
        ).toList();

        return filteredTasks;
    }

    public String setTaskAsCompleted(BigInteger id){
        Task task = taskRepository.findById(id).orElseThrow();
        task.setStatus(1);
        taskRepository.save(task);
        return "Success!";
    }

    public String setTaskAsUncompleted(BigInteger id){

        Task task = taskRepository.findById(id).orElseThrow();
        task.setStatus(0);
        taskRepository.save(task);
        return "Success!";
    }

    public Task getTaskOwnerById(BigInteger id){
        return taskRepository.findTaskownerById(id);
    }

}
