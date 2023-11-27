import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MainContainer,
  MessageInput,
  MessageHeader,
  MessageList,
  MessageContainer
} from "@minchat/react-chat-ui";



const App = () => {
  const [collectedMessages, setMessages] = useState([{
    text: 'Hello',
    user: {
        id: 'assistant',
        name: 'Assistant',
    },
}]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMode, setChatMode] = useState('normal');

  useEffect(() => {
    if (inputMessage.trim() !== '') {
      fetchMessages();
    }
  }, [chatMode]);

  const fetchMessages = async (text) => {
    try {
      const apiUrl =
        chatMode === 'dropout' || 'user'
          ? 'https://backend-finetune-gpt.vercel.app/api/product/chatbot-dropout'
          : 'https://backend-finetune-gpt.vercel.app/api/product/chatbot-normal';
      const newMessageUser = {
            text: text,
            user: {
              id: 'dan',
              name: 'Dan',
            },
          };
          //setMessages([...collectedMessages, newMessageUser])
      const response = await axios.post(apiUrl, { message: text });
      console.log('Response',response)
      
      const newMessage = {
        text: response.data.response,
        user: {
          id: 'assistant',
          name: 'Assistant',
        },
      };

      setMessages([...collectedMessages,newMessageUser, newMessage]);
      setInputMessage('');
    } catch (error) {
      console.error('Error fetching collectedMessages:', error);
      const errorMessage = 'Error occurred while processing your request.';
      const errorResponse = {
        text: errorMessage,
        user: {
          id: 'assistant',
          name: 'Assistant',
        },
      };
      setMessages([...collectedMessages, errorResponse]);
    }
  };

  const handleInputChange = (e) => {
    console.log("handleinput change")
    setInputMessage(e.target);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = (text) => {
    setInputMessage(text)
    console.log("inside handle messages",text)
    if (text.trim() !== '') {
      console.log("inside if")
      fetchMessages(text);
    }
  };

  const handleModeChange = (e) => {
    setChatMode(e.target.value);
    setMessages([]);
  };

  return (
    <MainContainer style={{ height: '100vh' }}>
      
      <MessageContainer>
      <div className="radio-container" style={{backgroundColor:'#F3F4F6',borderRadius:'20px',alignItems:'center',justifyContent:'center',textAlign:'center',paddingTop:'10px'}}>
        <h3>PHARMACEUTICAL DRUG REVIEW CHATBOT</h3>
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
        <input
          type="radio"
          id="dropout"
          name="chatMode"
          value="user"
          checked={chatMode === 'user'}
          onChange={handleModeChange}
        />
        <label htmlFor="dropout">User Generated Data</label>
        <h5 style={{ fontSize: '12px', textAlign: 'center' }}>
        Use a prompt like this: "My age group is AGE_GROUP. Tell me about a user's experience with DRUG_NAME"
      </h5>
      </div>
    
        <MessageHeader />
        <MessageList
          currentUserId='dan'
          messages={collectedMessages}
        />
        {console.log(collectedMessages)}
        <MessageInput
          placeholder="Type a message..."
          onSendMessage={handleSendMessage}
         
          value={inputMessage}
        />
        {/* <h5 style={{ fontSize: '12px' }}>Use a prompt like this:"My age group is AGE_GROUP. Tell me about a user's experience with DRUG_NAME"</h5> */}
      </MessageContainer>
    </MainContainer>
  );
};

export default App;
