import React from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import IALabForumComment from './IALabForumComment';

const IALabForumCommentThread = ({ comments, onReply, depth = 0 }) => {
  if (!comments?.length) return null;

  return (
    <div className={`space-y-2 ${depth > 0 ? 'ml-6 pl-3 border-l-2 border-petroleum/10 dark:border-petroleum/20' : ''}`}>
      {comments.map((comment) => (
        <IALabForumComment
          key={comment.id}
          comment={comment}
          onReply={onReply}
          depth={depth}
        >
          {comment.children?.length > 0 && (
            <IALabForumCommentThread
              comments={comment.children}
              onReply={onReply}
              depth={depth + 1}
            />
          )}
        </IALabForumComment>
      ))}
    </div>
  );
};

export default IALabForumCommentThread;
