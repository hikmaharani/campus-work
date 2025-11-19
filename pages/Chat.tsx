import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/UI';
import { Send, Search, MoreVertical, Phone, Video, MessageSquare, ArrowLeft } from 'lucide-react';
import { useApp } from '../App';
import { ChatThread, Message } from '../types';

const Chat = () => {
  const { user } = useApp();
  const location = useLocation();
  
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadChats = () => {
    if (!user) return;
    const dbChatsStr = localStorage.getItem('campuswork_db_chats');
    if (dbChatsStr) {
        const dbChats: ChatThread[] = JSON.parse(dbChatsStr);
        // Filter chats where current user is participant
        const myChats = dbChats.filter(c => c.participants.includes(user.id));
        // Sort by last timestamp
        myChats.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
        setChats(myChats);
    }
  };

  // Load chats from localStorage on mount
  useEffect(() => {
      loadChats();

      // Check if we navigated here with a specific chat to open
      const passedChatId = location.state?.activeChatId;
      if (passedChatId) {
          setActiveChatId(passedChatId);
      }

      // Poll for new messages (Simple simulation of real-time)
      const interval = setInterval(loadChats, 2000);
      return () => clearInterval(interval);

  }, [user, location.state]); // Re-run if location.state changes (e.g., navigating from ServiceDetail)

  const activeChat = chats.find(c => c.id === activeChatId);

  const getOtherParticipant = (chat: ChatThread) => {
      if (!user) return { name: 'Unknown', avatar: '' };
      const otherId = chat.participants.find(p => p !== user.id);
      if (!otherId || !chat.participantDetails[otherId]) return { name: 'Unknown User', avatar: '' };
      return chat.participantDetails[otherId];
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId || !user) return;

    const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        text: messageInput,
        senderId: user.id,
        timestamp: Date.now(),
        isRead: false
    };

    // Update local state immediately for responsiveness
    const updatedChats = chats.map(c => {
        if (c.id === activeChatId) {
            return {
                ...c,
                messages: [...c.messages, newMessage],
                lastMessage: newMessage.text,
                lastTimestamp: newMessage.timestamp
            };
        }
        return c;
    });
    
    setChats(updatedChats);
    setMessageInput('');

    // Persist to "DB"
    const dbChatsStr = localStorage.getItem('campuswork_db_chats');
    if (dbChatsStr) {
        const dbChats: ChatThread[] = JSON.parse(dbChatsStr);
        const chatIndex = dbChats.findIndex(c => c.id === activeChatId);
        if (chatIndex > -1) {
            dbChats[chatIndex].messages.push(newMessage);
            dbChats[chatIndex].lastMessage = newMessage.text;
            dbChats[chatIndex].lastTimestamp = newMessage.timestamp;
            localStorage.setItem('campuswork_db_chats', JSON.stringify(dbChats));
        }
    }
  };

  const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredChats = chats.filter(chat => {
      const other = getOtherParticipant(chat);
      return other.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex animate-in fade-in duration-500">
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Pesan</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    placeholder="Cari pesan..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredChats.length > 0 ? filteredChats.map(chat => {
                const other = getOtherParticipant(chat);
                return (
                    <div 
                        key={chat.id} 
                        onClick={() => setActiveChatId(chat.id)}
                        className={`p-4 flex items-center cursor-pointer transition-all border-b border-gray-50 hover:bg-gray-50 ${activeChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="relative mr-3">
                             <img src={other.avatar} className="w-12 h-12 rounded-full object-cover bg-gray-200" alt={other.name} />
                             {/* Online indicator mock */}
                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className={`text-sm font-bold truncate ${activeChatId === chat.id ? 'text-primary' : 'text-gray-900'}`}>{other.name}</h3>
                                <span className="text-xs text-gray-400">{chat.lastTimestamp ? formatTime(chat.lastTimestamp) : ''}</span>
                            </div>
                            <p className={`text-xs truncate ${activeChatId === chat.id ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                                {chat.messages.length > 0 ? (chat.messages[chat.messages.length - 1].senderId === user.id ? 'Anda: ' : '') + chat.lastMessage : 'Mulai percakapan'}
                            </p>
                        </div>
                    </div>
                );
            }) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                    Belum ada pesan. Cari jasa dan mulai chat dengan freelancer!
                </div>
            )}
        </div>
      </div>

      {/* Conversation Area */}
      <div className={`flex-1 flex flex-col bg-white ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
            <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                    <div className="flex items-center">
                        <button className="md:hidden mr-3 text-gray-500" onClick={() => setActiveChatId(null)}>
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="relative">
                            <img src={getOtherParticipant(activeChat).avatar} alt="User" className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="ml-3">
                            <h3 className="font-bold text-gray-900">{getOtherParticipant(activeChat).name}</h3>
                            <p className="text-xs text-green-600 font-medium">Sedang Online</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-primary transition-colors"><Phone className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-primary transition-colors"><Video className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50 flex flex-col">
                    <div className="flex justify-center mb-4">
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Percakapan Aman</span>
                    </div>
                    
                    {activeChat.messages.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                            Mulai percakapan dengan menyapa!
                        </div>
                    )}

                    {activeChat.messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                                msg.senderId === user.id 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                            }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] block mt-1 opacity-70 ${msg.senderId === user.id ? 'text-blue-100 text-right' : 'text-gray-400'}`}>{formatTime(msg.timestamp)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="flex gap-3 items-center bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                        <input 
                            className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm text-gray-700"
                            placeholder="Ketik pesan..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <Button type="submit" size="sm" className="rounded-full w-9 h-9 p-0 flex items-center justify-center shadow-md hover:shadow-lg">
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 text-gray-300" />
                </div>
                <p className="font-medium">Pilih percakapan untuk mulai chat</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Chat;