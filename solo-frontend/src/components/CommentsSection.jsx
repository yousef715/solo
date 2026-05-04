import { useState, useEffect } from 'react';
import { getComments, createComment } from '../api';
import { useAuth } from '../context/AuthContext';

function CommentsSection({ moduleId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchComments();
  }, [moduleId]);

  async function fetchComments() {
    try {
      const res = await getComments(moduleId);
      setComments(res.data.data);
    } catch (error) {
      console.error('Failed to load comments', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await createComment({
        content: newComment,
        user: user.id,
        module: moduleId
      });
      
      // Add new comment to state with user populated manually for UI
      const newCommentData = res.data.data;
      newCommentData.user = user; 
      
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment', error);
      setErrorMsg('Failed to post comment. Make sure the backend is updated!');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="text-center py-4"><span className="loading loading-spinner"></span></div>;
  }

  return (
    <div className="mt-8 border-t border-base-300 pt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
        Discussion & Q&A
      </h3>

      <div className="flex flex-col gap-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-base-content/60 text-center py-4 bg-base-200 rounded-lg">No questions yet. Be the first to ask! 🤔</p>
        ) : (
          comments.map(comment => (
            <div key={comment.documentId || comment.id} className="bg-base-200 rounded-xl p-4 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-sm uppercase">{comment.user?.username?.charAt(0) || '?'}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold">{comment.user?.username || 'Unknown User'}</span>
                  <span className="text-xs text-base-content/50">
                    {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-base-content/90 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2 items-start">
          <div className="avatar placeholder hidden sm:flex">
            <div className="bg-secondary text-secondary-content rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-sm uppercase">{user.username?.charAt(0)}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <textarea 
              className="textarea textarea-bordered w-full focus:textarea-primary min-h-[80px]" 
              placeholder="Ask a question or share your thoughts on this lesson..."
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              disabled={submitting}
            ></textarea>
            {errorMsg && <p className="text-error text-sm px-1">{errorMsg}</p>}
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="btn btn-primary btn-sm px-6"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? <span className="loading loading-spinner loading-xs"></span> : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="alert bg-base-200 text-base-content/70">
          <p>Please <a href="/login" className="link link-primary font-bold">log in</a> to participate in the discussion.</p>
        </div>
      )}
    </div>
  );
}

export default CommentsSection;
