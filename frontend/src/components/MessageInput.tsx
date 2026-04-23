import React, { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, AlertTriangle } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, isEmergency: boolean) => void;
  isEmergency?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isEmergency = false,
  disabled = false,
  placeholder = 'Type a message...',
  className
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    onSendMessage(message, isEmergency);
    setMessage('');
  };

  return (
    <form
      className={`flex w-full gap-2 ${className}`}
      onSubmit={handleSubmit}
    >
      <Input
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        className={isEmergency ? 'border-red-300 focus-visible:ring-red-300' : ''}
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !message.trim()}
        className={isEmergency ? 'bg-red-500 hover:bg-red-600' : ''}
      >
        {isEmergency ? <AlertTriangle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
};

export default MessageInput;