import { Modal } from 'bootstrap';
import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

const PostApi = ({ setInput }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        return () => {
            // 팝업이 열려 있는 경우 닫기
            if (isPopupOpen) {
                setIsPopupOpen(false);
            }
        };
    }, [isPopupOpen]);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        // Update input fields
        setInput({
            cinemaPost: data.zonecode, // 우편번호
            cinemaAddress1: fullAddress, // 전체 주소
            cinemaAddress2: '' // 상세 주소 입력을 위해 초기화
        });

        // Close the postcode popup
        setIsPopupOpen(false);
    };

    return (
        <>
            <button className='btn' onClick={() => setIsPopupOpen(true)}>검색</button>
            {isPopupOpen && <DaumPostcode onComplete={handleComplete}
                 onClose={() => setIsPopupOpen(false)} />}
        </>
    );
};

export default PostApi;
