import React from "react";

const Spinner = () => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="dotted-spinner"></div>
  </div>
);

export default Spinner;
