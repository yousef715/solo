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
  const [replyingTo, setReplyingTo] = useState(null);

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

  async function handleSubmit(e, parentId = null) {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        content: newComment,
        user: user.id,
        module: moduleId
      };
      
      if (parentId) {
        payload.parent = parentId;
      }

      const res = await createComment(payload);
      
      // Add new comment to state with user populated manually for UI
      const newCommentData = res.data.data;
      newCommentData.user = user; 
      if (parentId) {
        newCommentData.parent = { documentId: parentId }; // Mock parent for UI
      }
      
      setComments([...comments, newCommentData]);
      setNewComment('');
      setReplyingTo(null);
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

  // Build a tree of comments (2 levels: Parent -> Replies)
  const topLevelComments = comments.filter(c => !c.parent);
  const getReplies = (parentId) => comments.filter(c => c.parent?.documentId === parentId || c.parent?.id === parentId);

  const ReplyForm = ({ parentId, onCancel }) => (
    <form onSubmit={(e) => handleSubmit(e, parentId)} className="flex gap-2 items-start mt-3 w-full animate-in fade-in slide-in-from-top-2">
      <div className="avatar placeholder hidden sm:flex">
        <div className="bg-secondary text-secondary-content rounded-full w-8 h-8 flex items-center justify-center">
          <span className="text-xs uppercase">{user.username?.charAt(0)}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <textarea 
          className="textarea textarea-bordered textarea-sm w-full focus:textarea-primary min-h-[60px]" 
          placeholder="Write a reply..."
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          disabled={submitting}
          autoFocus
        ></textarea>
        {errorMsg && <p className="text-error text-sm px-1">{errorMsg}</p>}
        <div className="flex justify-end gap-2">
          <button 
            type="button" 
            className="btn btn-ghost btn-xs"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary btn-xs px-4"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? <span className="loading loading-spinner loading-xs"></span> : 'Reply'}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="mt-8 border-t border-base-300 pt-6">
      <div className="collapse collapse-arrow bg-base-200/30 border border-base-300 rounded-2xl">
        <input type="checkbox" defaultChecked /> 
        <div className="collapse-title p-4">
          <h3 className="text-xl font-bold flex items-center gap-2 m-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Discussion & Q&A
            <span className="badge badge-primary badge-sm ml-2">{comments.length}</span>
          </h3>
        </div>
        
        <div className="collapse-content px-4 pb-4">
          <div className="divider mt-0 mb-4"></div>

      <div className="flex flex-col gap-4 mb-6">
        {topLevelComments.length === 0 ? (
          <p className="text-base-content/60 text-center py-4 bg-base-200 rounded-lg">No questions yet. Be the first to ask! 🤔</p>
        ) : (
          topLevelComments.map(comment => {
            const commentId = comment.documentId || comment.id;
            const replies = getReplies(commentId);

            return (
              <div key={commentId} className="bg-base-200/50 rounded-xl p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                {/* Parent Comment */}
                <div className="flex gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                      <span className="text-sm uppercase font-bold">{comment.user?.username?.charAt(0) || '?'}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-base-content">{comment.user?.username || 'Unknown User'}</span>
                      <span className="text-xs text-base-content/50">
                        {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-base-content/90 whitespace-pre-wrap text-sm">{comment.content}</p>
                    
                    {user && (
                      <button 
                        onClick={() => { setReplyingTo(commentId); setNewComment(''); }}
                        className="text-xs font-semibold text-primary hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Reply
                      </button>
                    )}
                  </div>
                </div>

                {/* Reply Box for Parent */}
                {replyingTo === commentId && (
                  <div className="ml-14 pl-4 border-l-2 border-base-300">
                    <ReplyForm parentId={commentId} onCancel={() => setReplyingTo(null)} />
                  </div>
                )}

                {/* Replies List */}
                {replies.length > 0 && (
                  <div className="ml-14 flex flex-col gap-3 mt-2">
                    {replies.map(reply => (
                      <div key={reply.documentId || reply.id} className="flex gap-3 relative before:absolute before:-left-8 before:top-4 before:w-6 before:h-px before:bg-base-300 border-l-2 border-base-300 pl-4 py-1">
                        <div className="avatar placeholder">
                          <div className="bg-secondary text-secondary-content rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                            <span className="text-xs uppercase font-bold">{reply.user?.username?.charAt(0) || '?'}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-sm text-base-content">{reply.user?.username || 'Unknown User'}</span>
                            <span className="text-xs text-base-content/50">
                              {new Date(reply.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-base-content/80 whitespace-pre-wrap text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {user ? (
        !replyingTo && (
          <form onSubmit={(e) => handleSubmit(e, null)} className="flex gap-3 items-start bg-base-200/50 p-4 rounded-xl border border-base-300">
            <div className="avatar placeholder hidden sm:flex">
              <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                <span className="text-sm uppercase font-bold">{user.username?.charAt(0)}</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <textarea 
                className="textarea textarea-bordered w-full focus:textarea-primary min-h-[80px]" 
                placeholder="Ask a new question or start a discussion..."
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
        )
      ) : (
        <div className="alert bg-base-200 text-base-content/70">
          <p>Please <a href="/login" className="link link-primary font-bold">log in</a> to participate in the discussion.</p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default CommentsSection;
