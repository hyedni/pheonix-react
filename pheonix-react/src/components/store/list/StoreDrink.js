import StoreList from "./StoreList";
import StoreJumbotron from "../StoreJumbotron";

const StoreDrink = ()=>{

    return (
        <>
            <StoreJumbotron title="음료" subTitle="음료를 많이 마시면 중간에 화장실 갑니다" />
            <StoreList />
        </>
    );
};

export default StoreDrink;