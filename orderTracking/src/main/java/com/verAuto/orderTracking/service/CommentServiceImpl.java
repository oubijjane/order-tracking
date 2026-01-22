package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CommentDTO;
import com.verAuto.orderTracking.dao.CommentDAO;
import com.verAuto.orderTracking.entity.Comment;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
    public List<Comment> getAllComments() {
        return commentDAO.findAll();
    }

    @Override
    public List<Comment> getAllActiveComments() {
        return commentDAO.getCommentByIsActive(true);
    }

    @Override
    public Comment saveNewComment(CommentDTO commentDTO) {
        String newComment = commentDTO.getLabel().trim();
        if(commentDAO.existsByLabel(newComment)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le commentaire existe déjà");
        }
        Comment comment = new Comment();
        comment.setLabel(newComment);
        comment.setActive(true);
        return commentDAO.save(comment);
    }

    @Override
    public Comment updateComment(long id, CommentDTO commentDTO) {
        Comment existingComment = findCommentById(id);
        String newComment = commentDTO.getLabel().trim();
        if(commentDAO.existsByLabel(newComment) && !existingComment.getLabel().equals(newComment)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le commentaire existe déjà");
        }

        existingComment.setLabel(newComment);
        existingComment.setActive(commentDTO.isActive());
        return commentDAO.save(existingComment);
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
