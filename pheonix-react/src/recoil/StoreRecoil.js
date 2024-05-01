//장바구니에 담기 위해 일어나는 모든 것들..........

import { atom} from "recoil";

//수량
const itemQtyState = atom({
    key : 'itemQtyState',
    default : 1
});

export {itemQtyState};