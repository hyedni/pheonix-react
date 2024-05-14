import React from 'react';
import './Lost.css';

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8 text-center">
          <nav className="nav-center">
          <ul className="pagination">
            <li className="page-item">
              <button className="page-link" onClick={prevPage}>이전</button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
              </li>
            ))}
            <li className="page-item">
              <button className="page-link" onClick={nextPage}>다음</button>
            </li>
          </ul>
        </nav>        
      </div>
    </div>

  );
};

export default Pagination;
