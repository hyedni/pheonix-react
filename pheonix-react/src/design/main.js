import './main.css';

function main() {
    return (
        <>
            <div id="carouselExampleSlidesOnly" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src={"/image/main1.png"} alt="First slide"/>
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="..." alt="Second slide"/>
                    </div>
                    <div class="carousel-item">
                        <img className="d-block w-100" src="..." alt="Third slide"/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default main;