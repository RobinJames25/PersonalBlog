import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import '../assets/css/Comments.css'; 

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('loading'); 

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/post/${postId}`);
        
        if (response.data.status === 'success') {
          setComments(response.data.data.comments);
          setStatus('idle');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setStatus('error');
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await api.post('/comments', {
        postId,
        authorName,
        content
      });

      if (response.data.status === 'success') {
        setComments([response.data.data.comment, ...comments]);
        setAuthorName('');
        setContent('');
        setStatus('idle');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setStatus('error');
    }
  };

  return (
    <div className="comments-wrapper">
      <h3 className="comments-title">Discussion ({comments.length})</h3>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="comment-input"
            placeholder="Your Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            disabled={status === 'submitting'}
          />
        </div>
        <div className="input-group">
          <textarea
            className="comment-input textarea"
            placeholder="Add to the discussion..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="4"
            disabled={status === 'submitting'}
          ></textarea>
        </div>
        
        {status === 'error' && (
          <div className="status-message error">Failed to post comment. Try again.</div>
        )}

        <button 
          type="submit" 
          className="comment-btn"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {status === 'loading' ? (
          <p className="loading-text">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="no-comments-text">Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.authorName}</strong>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-body">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;