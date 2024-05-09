import { useEffect, useState } from "react";


function Calender() {
      const date = new Date();

      // 달력 월
      const calendarMonth = date.getMonth() + 1;

      const [weekDays, setWeekDays] = useState([]);
  
      useEffect(() => {
          const today = new Date(); // 오늘 날짜를 기준으로
          const days = [];
          var calendarDays = ["일", "월", "화", "수", "목", "금", "토"];
  
         // 오늘부터 시작해서 일주일간 날짜 계산
         for (let i = 0; i < 14; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i); // 오늘 날짜에 i일을 더함
            const day = nextDay.getDate(); // 일자
            const weekDay = calendarDays[nextDay.getDay()]; // 요일을 calendarDays 배열에서 가져옴
            const dayInfo = {
                  date: `${weekDay}     ${day}`, // 날짜와 요일을 문자열로 함께 저장
                  weekDayIndex: nextDay.getDay() // 요일의 인덱스 (일요일: 0, 토요일: 6)
              };
            days.push(dayInfo); // 날짜와 요일을 문자열로 함께 저장
        }
          setWeekDays(days); // 상태 업데이트
      }, []); // 컴포넌트 마운트 시 한 번만 실행
  
      return (
          <>
  
              <div className="col-1 book-wrapper">
                  <table>
                      <tr><th>날짜</th></tr>
                      <tr><td>{calendarMonth}월</td></tr>
                      {weekDays.map((day, index) => (
                          <tr><td key={index} 
                                    style={{color: day.weekDayIndex === 0 ? 'red' : day.weekDayIndex === 6 ? 'blue' : 'black', whiteSpace: 'pre-wrap' }}>
                              {day.date}
                           </td></tr> //배열의 각 요소를 리스트 아이템으로 렌더링
                      ))}
                  </table>
              </div>
  
          </>
      );
  }
  
  export default Calender;