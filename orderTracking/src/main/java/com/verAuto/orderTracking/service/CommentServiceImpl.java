package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CommentDAO;
import com.verAuto.orderTracking.entity.Comment;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService{

    private final CommentDAO commentDAO;

    @Autowired
    public CommentServiceImpl(CommentDAO commentDAO) {
        this.commentDAO = commentDAO;
    }

    @Override
    public Comment findCommentById(Long id) {
        return commentDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("could not find comment with the id - " + id));
    }

    @Override
    public List<Comment> getAllActiveComments() {
        return commentDAO.getCommentByIsActive(true);
    }

    @Override
    public Comment saveNewComment(Comment comment) {
        comment.setId(null);
        return commentDAO.save(comment);
    }

    @Override
    public Comment updateComment(Comment comment) {
        return null;
    }

    @Override
    public void deleteCommentById(Long id) {
        boolean exists = commentDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("company with ID " + id + " does not exist");
        }
        commentDAO.deleteById(id);

    }
}
