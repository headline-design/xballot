import React, { useState, useEffect } from 'react';

function ProgressBar({ barStyle, message, timer }) {
  
  return (
    <div>
      <div className="m-4 space-y-2">
        <h2 className="sr-only">Steps</h2>

        <div>
          <p className="text-xs font-medium text-gray-500">{message}</p>
<span>{timer}</span>
          <div className="mt-4 overflow-hidden rounded-full bg-gray-200">
            <div style={barStyle} className={`h-2 rounded-full bg-blue-500`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
