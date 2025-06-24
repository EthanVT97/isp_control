
import React from 'react';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  timestamp?: string;
  avatarUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser, timestamp, avatarUrl }) => {
  const alignClass = isUser ? 'items-end' : 'items-start';
  const bubbleClass = isUser ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-800';
  const defaultAvatar = isUser ? 'https://picsum.photos/seed/user/40/40' : 'https://picsum.photos/seed/bot/40/40';

  return (
    <div className={`flex flex-col mb-3 ${alignClass}`}>
      <div className="flex items-end space-x-2">
        {!isUser && (
          <img src={avatarUrl || defaultAvatar} alt="avatar" className="w-8 h-8 rounded-full" />
        )}
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow ${bubbleClass}`}
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {text}
        </div>
        {isUser && (
          <img src={avatarUrl || defaultAvatar} alt="avatar" className="w-8 h-8 rounded-full" />
        )}
      </div>
      {timestamp && (
        <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </p>
      )}
    </div>
  );
};

export default ChatMessage;
