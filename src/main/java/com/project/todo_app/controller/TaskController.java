package com.project.todo_app.controller;

import java.math.BigInteger;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.todo_app.model.Task;
import com.project.todo_app.model.TaskRequest;
import com.project.todo_app.service.TaskService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/addTask")
    public ResponseEntity<Task> addTask(@RequestBody String taskTitle, @AuthenticationPrincipal Jwt jwt) {
        String owner = jwt.getClaim("preferred_username");
        Task task = taskService.addTask(taskTitle,owner);
        return new ResponseEntity<>(task, HttpStatus.CREATED);
    }

    @GetMapping("/{task}")
    public ResponseEntity<List<TaskRequest>> getTasksByTask(@PathVariable String task, @AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok(taskService.getTasksByTask(task,jwt.getClaim("preferred_username")));
    }

    @PreAuthorize("hasAuthority('admin')")
    @GetMapping("/getAllTasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/get")
    public ResponseEntity<List<TaskRequest>> getTasksByOwner(@AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok(taskService.getTasksByOwner(jwt.getClaim("preferred_username")));
    }

    @PutMapping("/completed")
    public ResponseEntity<String> completeTask(@RequestBody String id){
        BigInteger taskId = new BigInteger(id);
        return ResponseEntity.ok(taskService.setTaskAsCompleted(taskId));
    }

    @PutMapping("/uncompleted")
    public ResponseEntity<String> uncompleteTask(@RequestBody String id){
        BigInteger taskId = new BigInteger(id);
        return ResponseEntity.ok(taskService.setTaskAsUncompleted(taskId));
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<List<TaskRequest>> deleteAllTasks(@AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok(taskService.deleteTaskByOwner(jwt.getClaim("preferred_username")));
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<BigInteger> deleteTaskById(@PathVariable String taskId, @AuthenticationPrincipal Jwt jwt) {
        String ownerUserName = jwt.getClaim("preferred_username");

        try {
            BigInteger id = new BigInteger(taskId);
            String taskUserName = taskService.getTaskOwnerById(id).getOwner();

            if (!taskUserName.trim().equals(ownerUserName.trim())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            log.info("Task deleted. task username: {} owner username: {}", taskUserName, ownerUserName);

            return ResponseEntity.ok(taskService.deleteTaskById(id));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
