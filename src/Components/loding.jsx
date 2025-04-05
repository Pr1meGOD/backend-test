import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import "./loading.css"; 

const Loading = ({ loading }) => {
  return (
    loading && (
      <div className="loading-overlay">
        <PropagateLoader color="#aa0101" size={15} />
      </div>
    )
  );
};

export default Loading;
