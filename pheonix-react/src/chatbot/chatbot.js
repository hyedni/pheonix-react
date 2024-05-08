import React, { useState } from 'react';
import SockJS from 'sockjs-client';
import './chatbot.css'; // 스타일 파일 import ㅇ

function Chatbot() { 
  const [socket, setSocket] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState('');

  const openChatbot = () => {
    const newSocket = new SockJS("http://localhost:8080/ws/chatbot", {questions, answer});
    newSocket.onmessage = handleMessage;
    setSocket(newSocket);
  };

  const handleMessage = (event) => {
    const data = JSON.parse(event.data);
    if (Array.isArray(data)) {
      setQuestions(data);
    } else {
      setAnswer(data.chatbotAnswer);
    }
  };

  const sendQuestion = (chatbotNo) => {
    if (socket) {
      socket.send(chatbotNo);
    }
  };

  return (
    <div className='row mt-4'>
      <div className="col">
        <div className="chatbot-container">
          <div className="question-wrapper">
            {questions.map((question) => (
              <button
                key={question.chatbotNo}
                onClick={() => sendQuestion(question.chatbotNo)}
                className="chatbot-question-button"
              >
                {question.chatbotQue}
              </button>
            ))}
          </div>
          <div className="answer-wrapper">
            {answer && <div className="chatbot-answer">{answer}</div>}
          </div>
        </div>
      </div>
      <button onClick={openChatbot}>Chatbot 열기</button>
    </div>
  );
}

export default Chatbot;
