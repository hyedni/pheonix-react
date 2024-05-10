import { useRecoilState } from "recoil";
//import { pgToken } from '../../utils/RecoilData';

const success= ()=>{

    //const [pgToken2, setPgToken2] = useRecoilState(pgToken);

    //QR화면이 다 진행된 후 반환되는 값을 가져오기
    //전체 URL, 그리고 URL에 있는 pg_token
    const result = window.location.href;
    // URL 객체를 생성하여 해시 부분을 추출합니다.
    const url = new URL(result);
    // 해시 부분에서 '?' 이후의 쿼리 스트링 부분을 파싱합니다.
    const hashParts = url.hash.split('?');
    if(hashParts.length > 1) {
        const queryParams = new URLSearchParams(hashParts[1]);//첫번째 파람
        const pgToken2 = queryParams.get('pg_token');
        //setPgToken2(pgToken2);

        window.opener.postMessage({ type: 'successComplete', pgToken: pgToken2 }, '*');
        window.close();
    }

}

export default success;