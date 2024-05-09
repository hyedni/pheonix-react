import React, { useState } from 'react';
import axios from 'axios';
import './Bunsil.css'; // 스타일 파일 import

const Bunsil = () => {
    const [lostTitle, setLostTitle] = useState('');
    const [lostContent, setLostContent] = useState('');
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!lostTitle || !lostContent || !file) {
            setErrorMessage('다입력해라 콱시');
            return;
        }

        const formData = new FormData();
        formData.append('lost_title', lostTitle);
        formData.append('lost_content', lostContent);
        formData.append('attach', file);

        try {
            await axios.post('/lost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // 등록 성공 후 필드 초기화ㅇ
            setLostTitle('');
            setLostContent('');
            setFile(null);
            setErrorMessage('');
            alert('분실물 등록 성공이욤ㅋ');
        } catch (error) {
            console.error('분실물 등록 실패: ', error);
            setErrorMessage('분실물 등록 실패욤ㅋ');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="bunsil-container">
            <h2>분실물 등록</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="lostTitle">제목:</label>
                    <input type="text" id="lostTitle" value={lostTitle} onChange={(e) => setLostTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="lostContent">내용:</label>
                    <textarea id="lostContent" value={lostContent} onChange={(e) => setLostContent(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="attach">첨부 파일:</label>
                    <input type="file" id="attach" onChange={handleFileChange} />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">등록</button>
            </form>
        </div>
    );
};

export default Bunsil;
