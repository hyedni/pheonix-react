import axios from "../utils/CustomAxios";
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from 'bootstrap/js/dist/modal';

const Personal = () => {
    const [personals, setPersonals] = useState([]);
    const [selectedPersonal, setSelectedPersonal] = useState(null);
    const [input, setInput] = useState({
        personalId:"",
        personalTitle:"",
        personalContent:"",
    });
    const bsModal = useRef(null);
    const writeModal = useRef(null);
    const replyModal = useRef(null);

    const closeModal = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        if (modal) {
            modal.hide();
        }
    }, []);

    const closeReplyModal = useCallback(() => {
        const modal = Modal.getInstance(replyModal.current);
        if (modal) {
            modal.hide();
        }
    }, []);

    const loadData = useCallback(() => {
        axios({
            url: "/personal/",
            method: "get",
        })
        .then(resp => {
            setPersonals(resp.data);
        });
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const changeInput = useCallback((e) => {
        const { name, value } = e.target;
        setInput(prevInput => ({
            ...prevInput,
            [name]: value
        }));
    }, []);

    const saveInput = useCallback(() => {
        axios({
            url: "/personal/",
            method: "post",
            data: input
        })
        .then(() => {
            loadData();
            setInput({
                personalId:"",
                personalTitle:"",
                personalContent:"",
            });
            closeModal();
        });
    }, [input, loadData, closeModal]);

    const cancelInput = useCallback(() => {
        setInput({
            personalId:"",
            personalTitle:"",
            personalContent:"",
        });
        closeModal();
    }, [closeModal]);

    const openWriteModal = useCallback(() => {
        setInput({
            personalId:"",
            personalTitle:"",
            personalContent:"",
        });
        const modal = new Modal(writeModal.current);
        modal.show();
    }, []);

    const deletePersonal = useCallback((target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;
        axios({
            url: "/personal/"+target.personalNo,
            method: "delete"
        })
        .then(resp => {
            loadData();
        });
    }, [loadData]);

    const openContentModal = useCallback((selectedPersonal) => {
        setSelectedPersonal(selectedPersonal);
        const modal = new Modal(bsModal.current);
        modal.show();
    }, []);

    const [replyContent, setReplyContent] = useState("");

    const changeReplyContent = useCallback((e) => {
        setReplyContent(e.target.value);
    }, []);

    const saveReply = useCallback(() => {
        axios({
            url: `/personal/reply/${selectedPersonal.personalNo}`,
            method: "post",
            data: {
                replyContent: replyContent
            }
        })
        .then(() => {
            // 답글 저장 후, 선택된 개인 정보를 업데이트합니다.
            const newReply = {
                replyContent: replyContent,
                // 다른 필요한 속성 추가
            };
    
            setSelectedPersonal(prevPersonal => ({
                ...prevPersonal,
                replies: [...(prevPersonal.replies || []), newReply] // 기존 답글 배열과 새로운 답글을 합침
            }));
    
            // 답글 저장 후, 모달 닫기
            closeReplyModal();
        })
        .catch(error => {
            // 오류 처리
            console.error("Error saving reply:", error);
        });
    }, [selectedPersonal, replyContent, closeReplyModal]);
    
    
    
    
    const openReplyModal = useCallback((selectedPersonal) => {
        setSelectedPersonal(selectedPersonal);
        const modal = Modal.getInstance(replyModal.current);
        if (!modal) {
            const newModal = new Modal(replyModal.current);
            newModal.show();
        }
    }, []);

    return (
        <div className="container">
            <div className="text-center mb-3">
                <img src="/image/personal.png" alt="Personal" />
            </div>
            <div className="text-end mb-3">
                <NavLink to="/lost">분실물</NavLink>
            </div>
            <div className="text-end mb-3">
                <NavLink to="/chatbot">Chatbot</NavLink>
                </div>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th scope="col" style={{ fontSize: '18px' }}>번호</th>
                                <th scope="col" style={{ fontSize: '18px'}}>제목</th>
                                <th scope="col" style={{ fontSize: '18px'}}>글쓴이</th>
                                <th scope="col" style={{ fontSize: '18px'}}>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personals.map((item, index) => (
                                <tr key={index} onClick={(e) => { e.preventDefault(); openContentModal(item); }} style={{ cursor: 'pointer' }}>
                                    <td>{item.personalNo}</td>
                                    <td><strong><a href="#" onClick={() => openContentModal(item)}>{item.personalTitle}</a></strong></td>
                                    <td>{item.personalId}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={(e) => deletePersonal(item)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row justify-content-end">
                <div className="col-lg-8 text-end">
                    <button className="btn btn-positive" onClick={openWriteModal}>글쓰기</button>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={bsModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{selectedPersonal && selectedPersonal.personalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={cancelInput}></button>
                        </div>
                        <div className="modal-body">
                            {selectedPersonal && (
                                <>
                                    <p><strong>글쓴이:</strong> {selectedPersonal.personalId}</p>
                                    <p><strong>내용:</strong> {selectedPersonal.personalContent}</p>
                                    {selectedPersonal.replies && selectedPersonal.replies.map((reply, index) => (
                                        <div key={index}>
                                            <p><strong>답글 {index + 1}:</strong> {reply.replyContent}</p>
                                        </div>
                                    ))}
                                   <button type="button" className="btn btn-primary" onClick={() => openReplyModal(selectedPersonal)}>답글 작성</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="writeModal" tabIndex="-1" aria-labelledby="writeModalLabel" aria-hidden="true" ref={writeModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="writeModalLabel">글쓰기</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={cancelInput}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="personalId" className="form-label">이름</label>
                                    <input type="text" className="form-control" id="personalId" name="personalId" value={input.personalId} onChange={changeInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="personalTitle" className="form-label">제목</label>
                                    <input type="text" className="form-control" id="personalTitle" name="personalTitle" value={input.personalTitle} onChange={changeInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="personalContent" className="form-label">내용</label>
                                    <textarea className="form-control" id="personalContent" name="personalContent" value={input.personalContent} onChange={changeInput}></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelInput}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={saveInput}>저장</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="replyModal" tabIndex="-1" aria-labelledby="replyModalLabel" aria-hidden="true" ref={replyModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="replyModalLabel">답글 작성</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeReplyModal}></button>
                        </div>
                        <div className="modal-body">
                            {selectedPersonal && (
                                <>
                                    <p><strong>글쓴이:</strong> {selectedPersonal.personalId}</p>
                                    <p><strong>내용:</strong> {selectedPersonal.personalContent}</p>
                                    <div className="mb-3">
                                        <label htmlFor="replyContent" className="form-label">답글 내용</label>
                                        <textarea className="form-control" id="replyContent" name="replyContent" value={replyContent} onChange={changeReplyContent}></textarea>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeReplyModal}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={saveReply}>저장</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
    
export default Personal;
