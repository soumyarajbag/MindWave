'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import { chatWithAI } from '@/lib/gemini/client';
import { ChatMessage } from '@/types';
import toast from 'react-hot-toast';

export default function AICompanion() {
  const { currentMood, chatMessages, addChatMessage, clearChat } = useMoodStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithAI([...chatMessages, userMessage], currentMood?.category);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      addChatMessage(aiMessage);
    } catch (error) {
      console.error('Error chatting with AI:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 flex flex-col h-[600px]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold">AI Companion</h2>
        </div>
        {chatMessages.length > 0 && (
          <button onClick={clearChat} className="text-sm text-white/70 hover:text-white transition">
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        <AnimatePresence>
          {chatMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/70 py-8"
            >
              <p className="text-lg mb-2">👋 Hey there!</p>
              <p className="text-sm">
                {currentMood
                  ? `I noticed you're feeling ${currentMood.category}. How can I help you today?`
                  : "I'm here to chat and support you. What's on your mind?"}
              </p>
            </motion.div>
          )}

          {chatMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-white/70"
            >
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
              <span className="text-sm">AI is typing...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition text-white font-semibold"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser ? 'bg-white/20 text-white' : 'bg-white/10 text-white/90'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs text-white/50 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}
