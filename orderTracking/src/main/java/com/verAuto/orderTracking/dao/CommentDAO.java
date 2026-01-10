package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentDAO extends JpaRepository<Comment, Long> {
    List<Comment> getCommentByIsActive(boolean isActive);
    boolean existsByLabel(String label);
}
