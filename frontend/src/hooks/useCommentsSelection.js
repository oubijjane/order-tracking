import commentService from '../services/commentService';
import { useState, useEffect } from 'react';

export const useCommentsSelection = () => {
    const [comment, setComment] = useState([]);
    // 1. Fetch Cities on Mount
    useEffect(() => {
        commentService.getAllActiveComments()
            .then(data => setComment(data))
            .catch(err => console.error("Failed to load comments:", err));
    }, []); 
    // 2. Format options for the Dropdown component
    const commentOptions = comment.map(c => ({ value: c.id, label: c.label }));
    return commentOptions;
}