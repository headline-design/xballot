import React from 'react';
import './loader.css';

const EllipseLoader = () => {
  return (
    <div className="example-card-circle">
      <div
        data-v-59d6a78d=""
        data-v-e38981d2=""
        className="ep-container"
        style={{ width: 180, height: 180 }}
      >
        <div data-v-59d6a78d="" className="ep-content">
          <div data-v-59d6a78d="" className="ep-svg-container">
            <svg height={180} width={180} xmlns="http://www.w3.org/2000/svg" className="ep-svg">
              <g className="ep-circle--container">
                <defs>
                  {/**/}
                  {/**/}
                  {/**/}
                  {/**/}
                </defs>
                <g
                  data-v-7d0a0fbb=""
                  className="ep-circle"
                  style={{
                    transitionTimingFunction: 'ease-in-out',
                    transform: 'rotate(-90deg)',
                  }}
                >
                  <circle
                    data-v-7d0a0fbb=""
                    r="78.5"
                    cx="90"
                    cy="90"
                    stroke="#324c7e"
                    stroke-dasharray=""
                    fill="transparent"
                    stroke-width="3"
                    class="ep-circle--empty"
                    style="transition-duration: 700ms; transition-timing-function: ease-in-out;"
                  ></circle>
                  <circle
                    data-v-7d0a0fbb=""
                    r="87.5"
                    cx="90"
                    cy="90"
                    fill="transparent"
                    stroke="#7579ff"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-dasharray="549.7787143782137"
                    class="ep-circle--progress animation__rs"
                    style={{transition: "all 700ms ease-in-out 0s opacity 0.3s 0s", stroke-dashoffset: 214.414; transform-origin: 50% 50%; opacity: 1; --ep-circumference:549.779; --ep-negative-circumference:-549.779; --ep-double-circumference:1099.56; --ep-stroke-offset:214.414; --ep-loop-stroke-offset:-885.144; --ep-bounce-out-stroke-offset:114.414; --ep-bounce-in-stroke-offset:314.414; --ep-reverse-stroke-offset:1313.97; --ep-loading-stroke-offset:109.956; animation-duration: 700ms;"}}
                  ></circle>
                  {/**/}
                </g>
              </g>
            </svg>
            {/**/}
          </div>
          <div data-v-59d6a78d="" className="ep-legend--container" style={{ maxWidth: 180 }}>
            <div
              data-v-59d6a78d=""
              className="ep-legend--value"
              style={{ fontSize: '1.5rem', color: 'white' }}
            >
              <span data-v-59d6a78d="" className="ep-legend--value__counter">
                {/**/}
                <span data-v-59d6a78d="">61</span>
                {/**/}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EllipseLoader;
