
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
//import { useRecoilState } from 'recoil';


const Cart = () => {

    //state
    //const { userId } = useRecoilState({});
    const [carts, setCarts] = useState([]);

    //effect
    // useEffect(()=>{
    //     loadData();
    // }, []);

    //callback
    // const loadData = useCallback(() =>{
    //     axios.get(`/cart/list/{userId}`).then(resp => {
    //         setCarts(resp.data);
    //     });
    // }, [carts]);

    const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedItems([...selectedItems, value]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== value));
    }
  };

    return (
        <>

            <div>
                {/* {cartItem.length !== 0 ? cartItem.map((e) =>( */}
                {/* // <CartItem data={e} key={e.id} /> */}
                <h1>카트 출력</h1>
                {/* )) : <h1>아이템이 없습니다</h1>} */}


                {/* 장바구니 출력 */}


                <div className="row justify-content-center">
                    <div className="col-lg-8 content-body">

                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8 content-body">
                            <p className="list-group-item">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="item1" value="항목 1" onChange={handleCheckboxChange} />
                                    <label className="custom-control-label" htmlFor="checkboxall">항목 1</label>
                                </div>
                                <strong>상품명</strong>
                                <strong>판매금액</strong>
                                <strong>수량</strong>
                                <strong>구매금액</strong>
                                <strong>선택</strong>
                            </p>
                            <ul className="list-group">
                            <li className="list-group-item">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="item2" value="항목 2" onChange={handleCheckboxChange} />
                                    <label className="custom-control-label" htmlFor="item2">항목 2</label>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="item3" value="항목 3" onChange={handleCheckboxChange} />
                                    <label className="custom-control-label" htmlFor="item3">항목 3</label>
                                </div>
                            </li>
                            {/* 필요한 만큼 항목을 추가할 수 있습니다. */}
                        </ul>
                    </div>
                </div>













                <div class="container mt-5">
                    <h2>리스트 선택 예제</h2>
                    <p>리스트를 선택하세요.</p>
                    <ul class="list-group">
                        <li class="list-group-item">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="item1" />
                                <label class="custom-control-label" for="item1">항목 1</label>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="item2" />
                                <label class="custom-control-label" for="item2">항목 2</label>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="item3" />
                                <label class="custom-control-label" for="item3">항목 3</label>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Cart;