package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.CommentDTO;
import com.verAuto.orderTracking.entity.Comment;
import com.verAuto.orderTracking.service.CommentService;
import com.verAuto.orderTracking.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<Comment>>getAllActiveComments() {

        return new ResponseEntity<>(commentService.getAllActiveComments(), HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Comment>>getAllComments() {

        return new ResponseEntity<>(commentService.getAllComments(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable long id) {
        return new ResponseEntity<>(commentService.findCommentById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable long id, @RequestBody CommentDTO request) {
        System.out.println(request.isActive());
        return new ResponseEntity<>(commentService.updateComment(id, request), HttpStatus.OK);
    }
}
