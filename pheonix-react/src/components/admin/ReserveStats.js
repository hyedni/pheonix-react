import './RserveStats.css';
import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

function ReserveStats() {

    const [dataAll, setDataAll] = useState([]);
    const [chartData, setChartData] = useState([]);

    const today = new Date();
    function toChar() {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    const loadListAll = useCallback(async () => {
        const date = toChar();
        const resp = await axios.get(`/stats/${date}`);
        setDataAll(resp.data);
        const processedData = resp.data.map(item => ({
            label: item.movieTitle,
            data: item.reserveStatsRate,
            backgroundColor: ["#ffeb9b", "#b5f2ff", "#c5f2ba","#ffcccb", "#b0e0e6", "#f0ffff", "#d3d3d3"], 
            borderColor: ["#ffeb9b", "#b5f2ff", "#c5f2ba","#ffcccb", "#b0e0e6", "#f0ffff", "#d3d3d3"] 
        }));
        setChartData(processedData);
    }, []);

    useEffect(() => {
        loadListAll();
    }, []);

    //차트
    ChartJS.register(ArcElement, Tooltip, Legend);

    const Data = {
        labels: chartData.map(item => item.label),
        datasets: [
            {
                data: chartData.map(item => item.data),
                backgroundColor: ["#ffeb9b", "#b5f2ff", "#c5f2ba","#ffcccb", "#b0e0e6", "#f0ffff", "#d3d3d3"], 
                borderColor: ["#ffeb9b", "#b5f2ff", "#c5f2ba","#ffcccb", "#b0e0e6", "#f0ffff", "#d3d3d3"] 
            },
        ],
    };

    const Options = { aspectRatio: 1};



    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        예매율
                    </div>
                    <hr />
                    <div>
                        <ul className='detail-wrapper'>
                            <li>[예매율]은 매일 00시에 예매데이터를 집계하여 예매율 정보를 제공합니다.</li>
                            <li>예매율 산출기준 = A(예매관객수) / B(전체 예매관객수) * 100</li>
                            <li>예매관객수(A) : 매일 00시 기준 특정영화의 예매 건수</li>
                            <li>전체 예매관객수(B) : 매일 00시 기준 모든 영화의 예매 건수</li>
                            <li>즉, 현재 조회되는 예매율은 24시간 동안 유효하며 24시간 동안 변동되지 않습니다.</li>
                            <li>예매율은 현재 상영중인 영화에만 적용됩니다.</li>
                        </ul>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="offset-2 col-lg-8">
                    <div className='offset-4 row mt-3 mb-3'>
                        <div className='col' style={{ width: '400px', height: '400px' }}>
                            <Doughnut data={Data} options={Options}></Doughnut>
                        </div>
                    </div>
                    <div className='row mt-3 mb-3'>
                        <div className='col'>
                            <div className='text-end'>집계일시: {toChar()} 00시 </div>
                        </div>
                    </div>
                    <table className='table table-hover table-rate mb-5'>
                        <thead>
                            <tr style={{ fontSize: '15px', fontWeight: 'bolder' }}>
                                <th>순위</th>
                                <th>영화제목</th>
                                <th>개봉일</th>
                                <th>예매관객수</th>
                                <th>예매율</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataAll.map((data, index) => (
                                <tr key={data.reserveStatsNo}>
                                    <td>{index + 1}</td>
                                    <td>{data.movieTitle}</td>
                                    <td>{data.movieOpenDate}</td>
                                    <td>{data.reserveStatsMovie}명</td>
                                    <td>{data.reserveStatsRate.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>



        </>
    );
}

export default ReserveStats;