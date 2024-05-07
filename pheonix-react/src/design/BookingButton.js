import './BookingButton.css';
import { WiDirectionUp } from "react-icons/wi";

const BookingButton = () => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        <>
            <button className="booking-button" onClick={() => alert('예매 페이지 링크 연결할거임~')}>
                예매하기
            </button>
            <button className="scroll-to-top" onClick={scrollToTop}>
                <WiDirectionUp />
            </button>
        </>
    );
};

export default BookingButton;