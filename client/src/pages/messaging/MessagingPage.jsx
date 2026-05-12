import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, setActiveConversation, addMessage, setMessages } from '../../store/slices/messagingSlice';
import { messagingAPI } from '../../services/api';
import { connectMessagingSocket, getMessagingSocket } from '../../socket';
import toast from 'react-hot-toast';

const MessagingPage = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversation, messages, loading } = useSelector((state) => state.messaging);
  const { user } = useSelector((state) => state.auth);
  const [messageText, setMessageText] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [participantEmail, setParticipantEmail] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (!activeConversation) return;
    const fetchMessages = async () => {
      try {
        const res = await messagingAPI.getMessages(activeConversation._id);
        dispatch(setMessages(res.data.messages || []));
      } catch { toast.error('Failed to load messages'); }
    };
    fetchMessages();
  }, [activeConversation, dispatch]);

  useEffect(() => {
    if (!user) return;
    let token = '';
    try {
      const cookies = document.cookie.split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=');
        acc[k] = v;
        return acc;
      }, {});
      token = cookies.accessToken || '';
    } catch { /* ignore */ }
    const socket = connectMessagingSocket(token);

    socket.on('new-message', (message) => {
      if (activeConversation?._id === message.conversationId) {
        dispatch(addMessage(message));
      }
    });

    if (activeConversation) {
      socket.emit('join-conversation', activeConversation._id);
    }

    return () => {
      socket.off('new-message');
    };
  }, [user, activeConversation, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim() || !activeConversation) return;
    const socket = getMessagingSocket();
    if (socket) {
      socket.emit('send-message', {
        conversationId: activeConversation._id,
        content: messageText,
      });
    } else {
      messagingAPI.sendMessage({ conversationId: activeConversation._id, content: messageText })
        .then((res) => dispatch(addMessage(res.data.data.message)))
        .catch(() => toast.error('Failed to send'));
    }
    setMessageText('');
  };

  const handleNewChat = async () => {
    try {
      const res = await messagingAPI.createConversation({
        participantIds: [],
        subject: `Chat with ${participantEmail}`,
      });
      dispatch(fetchConversations());
      dispatch(setActiveConversation(res.data.data));
      setShowNewChat(false);
      setParticipantEmail('');
    } catch { toast.error('Failed to create conversation'); }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-80 flex-shrink-0 card flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Conversations</h2>
          <button onClick={() => setShowNewChat(!showNewChat)} className="btn-ghost text-sm">+ New</button>
        </div>
        {showNewChat && (
          <div className="flex gap-2 mb-3">
            <input className="input-field text-sm flex-1" placeholder="Email..." value={participantEmail} onChange={(e) => setParticipantEmail(e.target.value)} />
            <button onClick={handleNewChat} className="btn-primary text-sm px-3">Start</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv._id}
              onClick={() => dispatch(setActiveConversation(conv))}
              className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${activeConversation?._id === conv._id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`}
            >
              <p className="font-medium truncate">{conv.subject || conv.participants?.filter((p) => p._id !== user?.id).map((p) => `${p.firstName} ${p.lastName}`).join(', ') || 'Conversation'}</p>
              <p className="text-xs text-gray-400 mt-1 truncate">{conv.lastMessage?.content || 'No messages yet'}</p>
            </button>
          ))}
          {conversations.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No conversations</p>}
        </div>
      </div>

      <div className="flex-1 card flex flex-col">
        {activeConversation ? (
          <>
            <div className="border-b pb-3 mb-3">
              <h3 className="font-semibold">{activeConversation.subject || 'Chat'}</h3>
              <p className="text-xs text-gray-400">{activeConversation.participants?.filter((p) => p._id !== user?.id).map((p) => `${p.firstName} ${p.lastName} (${p.role})`).join(', ')}</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {messages.map((msg) => {
                const isMine = (msg.senderId?._id || msg.senderId) === user?.id;
                return (
                  <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl px-4 py-2 text-sm ${isMine ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>{new Date(msg.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2 border-t pt-3">
              <input
                className="input-field flex-1"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="btn-primary">Send</button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
