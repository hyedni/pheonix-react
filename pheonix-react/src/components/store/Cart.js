import { useRecoilState, useRecoilValue } from "recoil";
import { CartItemAtom } from "../../recoil/StoreRecoil";


const Cart= ()=>{

    // const [cartItem, setCartItem] = useRecoilState(CartItemAtom);
    const cartItem = useRecoilValue(CartItemAtom);

    return(
        <>
            <h1>장바구니</h1>

            <div>
                {cartItem.length !== 0 ? cartItem.map((e) =>(
                    // <CartItem data={e} key={e.id} />
                    <h1>카트 출력</h1>
                )) : <h1>아이템이 없습니다</h1>}
            </div>
        </>
    );
};

export default Cart;