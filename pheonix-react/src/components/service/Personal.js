import axios from "../utils/CustomAxios";
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from 'bootstrap/js/dist/modal';

const Personal = () => {
    const [personals, setPersonals] = useState([]);
    const [input, setInput] = useState({
        personalNo:"",
        personalId:"",
        personalTitle:"",
        personalContent:"",
        personalWrite:"",

    });
    const bsModal = useRef();

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
    }, []);

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
        .then(resp => {
            loadData();
            setInput({
                personalNo:"",
                personalId:"",
                personalTitle:"",
                personalContent:"",
                personalWrite:"",

            });
            closeModal();
        });
    }, [input, loadData]);

    const cancelInput = useCallback(() => {
        setInput({
            personalNo:"",
            personalId:"",
            personalTitle:"",
            personalContent:"",
            personalWrite:"",

        });
        closeModal();
    }, []);

    const deletePersonal = useCallback((target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if(choice === false) return;

        axios({
            url: "/personal/" + target.personalNo,
            method: "delete"
        })
        .then(resp => {
            loadData();
        });
    }, [loadData]);

    const openModal = useCallback(() => {
        const modal = new Modal(bsModal.current);
        modal.show();
    }, []);

    const closeModal = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, []);

    return (
        <div className="container">
        <div className="text-center mb-3">
            <img src="/image/personal.png" alt="Personal" />
        </div>
        <div className="text-end mb-3">
            <NavLink to="/lost">분실물</NavLink>
        </div>
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" style={{ fontSize: '18px' }}>이름</th>
                            <th scope="col" style={{ fontSize: '18px', textAlign: 'center' }}>제목</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 여기서 personals 배열을 매핑하여 각 row를 생성할 수 있습니다. */}
                        {personals.map((item, index) => (
                            <tr key={index}>
                                <td>{item.personalId}</td>
                                <td>{item.personalTitle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="row justify-content-end">
            <div className="col-lg-8 text-end">
                <button className="btn btn-positive" onClick={openModal}>글쓰기</button>
            </div>
        </div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={bsModal}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">1:1 문의게시판</h5>
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
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelInput}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={saveInput}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

};

export default Personal;
