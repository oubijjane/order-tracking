package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CommentDTO;
import com.verAuto.orderTracking.entity.Comment;

import java.util.List;

public interface CommentService {
    Comment findCommentById(Long id);
    List<Comment> getAllComments();
    List<Comment> getAllActiveComments();
    Comment saveNewComment(CommentDTO comment);
    Comment updateComment(long id, CommentDTO commentDTO);
    void deleteCommentById(Long id);
}
