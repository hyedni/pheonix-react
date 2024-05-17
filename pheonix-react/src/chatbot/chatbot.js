import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import './chatbot.css'; // 스타일 파일 import
import { NavLink } from 'react-router-dom';

function Chatbot() {
  const [socket, setSocket] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    openChatbot();
  }, []);

  const openChatbot = () => {
    const newSocket = new SockJS("http://localhost:8080/ws/chatbot", { questions, answer });
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
    <>
      <br />
      <div className="row justify-content-center mt-4">
        <div className="col-lg-8 content-body text-center">
          <img src="image/hey.png" alt="Chatbot 열기" className="chatbot-image" style={{ width: '150px', display: 'inline-block', verticalAlign: 'middle', marginRight: '20px' }} /> {/* 이미지 크기 조절 및 정렬 */}
          <p style={{ fontSize: "40px", fontWeight: "bold", display: 'inline-block', verticalAlign: 'middle' }} className='mt-4'>자주 묻는 질문</p> {/* 텍스트 크기를 키우고 굵게 만듦 */}
        </div>

      </div>


      <div className="row justify-content-center">
        <div className="col-lg-8 content-body">
          <div className="chatbot-container">
            <div className="question-wrapper">
              {questions.map((question) => (
                <>
                  <button
                    key={question.chatbotNo}
                    onClick={() => sendQuestion(question.chatbotNo)}
                    className="chatbot-question-button"
                  >
                    {question.chatbotQue}
                  </button>
                  <br />
                </>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {answer && <div className="chatbot-answer mt-4">{answer}</div>}
            </div>

          </div>
          <div className='mt-4 text-end'>
            <NavLink to="/personal" className="btn btn-secondary me-4"> {/* btn-sm 클래스 추가 */}
              문의게시판으로 돌아가기
            </NavLink>
          </div>
        </div>
      </div>

    </>
  );
}

export default Chatbot;
