import { stepOrder, useCurrentPosition } from './order';
import React, { useState } from 'react';
import { CheckmarkIcon } from 'icons/Checkmark';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const total = stepOrder.length;
  const { index } = useCurrentPosition();
  const current = index;
  const navigate = useNavigate();

  const steps = [
    { name: 'Getting started' },
    { name: 'Domain' },
    { name: 'Controller' },
    { name: 'Profile' },
  ];

  return (
    <>
      {/*
      <div>
        Step {current} of {total}
      </div>
  */}
      <div id="sidebar-left" className="float-left w-full lg:w-1/4">
        <div className="fixed hidden lg:block">
          <nav className="flex" aria-label="Progress">
            <ol role="list" className="space-y-4 pt-3">
              {steps.map((step, i) => (
                <li key={step.name}>
                  {current > i ? (
                    <div>
                      <span className="flex items-center">
                        <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                          <CheckmarkIcon className="text-[14px] text-white" />
                          {i > 0 && <span className="absolute -top-4 h-4 w-[1px] bg-primary" />}
                        </span>

                        <button
                          onClick={() => navigate('step=' + i)}
                          className="ml-3 text-base font-medium text-skin-text"
                        >
                          {step.name}
                        </button>
                      </span>
                    </div>
                  ) : current === i ? (
                    <div className="flex items-center" aria-current="step">
                      <span
                        className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border !border-primary"
                        aria-hidden="true"
                      >
                        <span className="absolute h-4 w-4 rounded-full" />
                        <span className="relative block h-2 w-2 rounded-full bg-primary" />
                        {i > 0 && <span className="absolute -top-[25px] h-4 w-[1px] bg-primary" />}
                      </span>
                      <span className="ml-3 text-base font-medium text-skin-link">{step.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div
                        className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        {i > 0 && (
                          <span className="absolute -top-[25px] h-4 w-[1px] bg-skin-border" />
                        )}
                      </div>
                      <span className="ml-3 text-base font-medium text-skin-text">{step.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
