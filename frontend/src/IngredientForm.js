import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Chatbot.css'; // Import your CSS file for styles

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMode, setChatMode] = useState('normal');

  useEffect(() => {
    if (inputMessage.trim() !== '') {
      fetchMessages();
    }
  }, [chatMode]);
  const fetchMessages = async () => {
    try {
      const apiUrl =
        chatMode === 'dropout'
          ? 'http://54.177.221.64:8001/chatbot-dropout'
          : 'http://54.177.221.64:8001/chatbot-normal';

      const response = await axios.post(apiUrl, { message: inputMessage });
      
      console.log("inutMessage",response.data.response)
      setMessages([
        ...messages,
        { text: inputMessage, type: 'user' },
        { text: response.data.response, type: 'assistant' },
      ]);
      setInputMessage('');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      fetchMessages();
    }
  };

  const handleModeChange = (e) => {
    setChatMode(e.target.value);
    setMessages([])
  };

  return (
    <div className="chatbot-container">

      <div className="header">

        <div className="radio-container">
          <input
            type="radio"
            id="normal"
            name="chatMode"
            value="normal"
            checked={chatMode === 'normal'}
            onChange={handleModeChange}
          />
          <label htmlFor="normal">Normal</label>

          <input
            type="radio"
            id="dropout"
            name="chatMode"
            value="dropout"
            checked={chatMode === 'dropout'}
            onChange={handleModeChange}
          />
          <label htmlFor="dropout">Dropout</label>
        </div>
        <h5 style={{fontSize:'12px'}}>Use a prompt like this:"My age group is AGE_GROUP. Tell me about a user's experience with DRUG_NAME"</h5>
      </div>
      <div className="chatbox">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
