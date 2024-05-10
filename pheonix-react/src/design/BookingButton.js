import { useNavigate } from 'react-router';
import './BookingButton.css';
import { WiDirectionUp } from "react-icons/wi";

const BookingButton = () => {

    const navigate = useNavigate();
    const moveToBook = () => {
        navigate('/booking');
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        <>
            <button className="booking-button" onClick={moveToBook}>
                예매하기
            </button>
            <button className="scroll-to-top" onClick={scrollToTop}>
                <WiDirectionUp />
            </button>
        </>
    );
};

export default BookingButton;