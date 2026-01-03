package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.Comment;

import java.util.List;

public interface CommentService {
    Comment findCommentById(Long id);
    List<Comment> getAllActiveComments();
    Comment saveNewComment(Comment comment);
    Comment updateComment(Comment comment);
    void deleteCommentById(Long id);
}
