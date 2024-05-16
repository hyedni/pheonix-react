//Recoil을 이용해서 전체 애플리케이션에서 사용할 데이터를 선언
// - 기존의 Spring Boot에서 사용하는 HttpSession을 대체할 예정

import {atom, selector} from "recoil";

//atom은 recoil 저장소에 변수를 생성하는 역할
const countState = atom({
    key : 'countState',//식별자(ID)
    default : 0//초기값
});

//로그인과 관련된 저장소 설정
const loginIdState = atom({
    key : 'loginIdState',
    default : ''
});
const loginGradeState = atom({
    key : 'loginGradeState',
    default : ''
});


//atom으로 생성한 데이터를 조합하여 무언가를 계산할 수 있다(selector)
const isLoginState = selector({
    key : 'loginState',//식별자
    get : (state)=>{//state를 불러와서 새로운 값을 계산해서 반환하는 함수
        //미리 만든 state 중에 loginIdState에 해당하는 값을 주세요
        const loginId = state.get(loginIdState);
        //미리 만든 state 중에 loginGradeState에 해당하는 값을 주세요
        const loginGrade = state.get(loginGradeState);

        return loginId && loginId.length >0 
                && loginGrade && loginGrade.length >0;
    }
});

//로그인과 관련된 저장소 설정
const nonUserEmailState = atom({
    key : 'nonUserEmailState',
    default : ''
});

const isNonUserState = selector({
    key : 'nonUserState',//식별자
    get : (state)=>{//state를 불러와서 새로운 값을 계산해서 반환하는 함수
        //미리 만든 state 중에 loginIdState에 해당하는 값을 주세요
        const nonUserEmail = state.get(nonUserEmailState);

        return nonUserEmail && nonUserEmail.length >0;
    }
});



const seatsState = atom({
    key: 'seatsState', // 고유한 key
    default: [], // 초기 상태 값
});

// const btnPurchase = atom({
//   key : 'btnPurchase',
//   default: false
// });

  //카카오페이
  const partnerOrderId = atom({
    key : 'partnerOrderId',
    default : ''
  }); 

  const partnerUserId = atom({
    key : 'partnerUserId',
    default : ''
  });

  const tid = atom({
    key : 'tid',
    default : ''
  });

  const vo = atom({
    key: 'vo',
    default: []
  });

  const pgToken = atom({
    key : 'pgToken',
    default : ''
  });




//default export는 하나밖에 할 수 없다
//export default countState;

//naming export는 여러 개 할 수 있다.
export {countState, loginIdState, loginGradeState, isLoginState , seatsState
    , partnerOrderId, partnerUserId, tid, vo, pgToken, isNonUserState
    //btnPurchase
};

