package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.entity.Comment;
import com.verAuto.orderTracking.service.CommentService;
import com.verAuto.orderTracking.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
