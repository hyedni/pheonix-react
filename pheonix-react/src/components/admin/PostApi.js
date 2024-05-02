import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

const PostApi = ({ onAddressChange }) => {
    const [zonecode, setZonecode] = useState('');
    const [address, setAddress] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const completeHandler = (data) => {
        const { address, zonecode } = data;
        onAddressChange(zonecode, address);  // 주소 데이터를 상위 컴포넌트로 전달
        // setIsOpen(false);  // 팝업 닫기
    };
    const closeHandler = (state) => {
        if (state === 'FORCE_CLOSE') {
            setIsOpen(false);
        } else if (state === 'COMPLETE_CLOSE') {
            setIsOpen(false);
        }
    };

    const toggleHandler = () => {
        setIsOpen((prevOpenState) => !prevOpenState);
    };

    const inputChangeHandler = (event) => {
        setAddress(event.target.value);
    };

    return (
        <div>

            <div>
                <div>
                    <button
                        type="button"
                        onClick={toggleHandler}
                    >
                       검색
                    </button>
                </div>
                {isOpen && (
                    <div>
                        <DaumPostcode
                            onComplete={completeHandler}
                            onClose={closeHandler}
                        />
                    </div>
                )}
                <input type="hidden"
                    value={address}
                    onChange={inputChangeHandler}
                />
            </div>
        </div>
    );
};

export default PostApi;

// import React, { useEffect, useState } from 'react';
// import DaumPostcode from 'react-daum-postcode';

// const PostApi = ({ setInput }) => {
//     const [isPopupOpen, setIsPopupOpen] = useState(false);

//     useEffect(() => {
//         return () => {
//             // 팝업이 열려 있는 경우 닫기
//             if (isPopupOpen) {
//                 setIsPopupOpen(false);
//             }
//         };
//     }, [isPopupOpen]);

//     const handleComplete = (data) => {
//         let fullAddress = data.address;
//         let extraAddress = '';

//         if (data.addressType === 'R') {
//             if (data.bname !== '') {
//                 extraAddress += data.bname;
//             }
//             if (data.buildingName !== '') {
//                 extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
//             }
//             fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
//         }

//         // Update input fields
//         setInput(prevInputs => ({
//             ...prevInputs,  // Keep all other input data intact
//             cinemaPost: data.zonecode, // 우편번호
//             cinemaAddress1: fullAddress, // 전체 주소
//             cinemaAddress2: '' // 상세 주소 입력을 위해 초기화
//         }));

//         // Close the postcode popup
//         setIsPopupOpen(false);
//     };

//     return (
//         <>
//             <button className='btn' onClick={() => setIsPopupOpen(true)}>검색</button>
//             {isPopupOpen && (
//                 <DaumPostcode
//                     onComplete={handleComplete}
//                     onClose={() => setIsPopupOpen(false)}
//                 />
//             )}
//         </>
//     );
// };

// export default PostApi;
