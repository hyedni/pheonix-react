import StoreList from "./StoreList";
import StoreJumbotron from "../StoreJumbotron";

const StorePopcorn = ()=>{

    return (
        <>
            <StoreJumbotron title="팝콘" subTitle="팝콘만 먹으면 목이 말라요" />
            <StoreList />
        </>
    );
};

export default StorePopcorn;