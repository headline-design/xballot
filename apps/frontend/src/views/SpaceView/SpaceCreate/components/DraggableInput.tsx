import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import AddInput from 'components/AddInput';
import { PlusIcon } from 'icons/Plus';

const DraggableInput = (props) => {
  const [optionLength, setOptionLength] = useState([{}]);
  const propRef = useRef(null);
  const sortableJsPropRef = useRef(null);

  const [data, setData] = useState(
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('prop-options')) || props.initData
      : props.initData,
  );

  const onListChange = () => {
    if (!propRef.current) return;
    const children = [...propRef.current.children];
    let newData = [];
    for (let i = 0; i < children.length; i++) {
      let id = children[i].dataset.id;
      if (data && data[id]) {
        let updatedData = { ...data[id] };
        updatedData.choice = i + 1;
        newData.push(updatedData);
      }
    }
    sessionStorage.setItem('prop-options', JSON.stringify(newData));
    setData(newData);
  };

  const handleChangeMethod = (e, name, key, idx) => {
    let arc = [...optionLength];
    if (name === 'royalties') {
      setOptionLength(e);
    } else if (name === 'totalSupply') {
      setOptionLength(e);
    } else {
      arc[idx][key] = e;
      setOptionLength(arc);
    }
  };

  const updateOptionLength = (type, idx) => {
    let i = [...optionLength];
    if (type === 1) {
      if (optionLength.length < 5) {
        i.push({});
        setOptionLength(i);
      }
    } else {
      i.splice(idx, 1);
      setOptionLength(i);
    }
  };

  useEffect(() => {
    sortableJsPropRef.current = new Sortable(propRef.current, {
      animation: 150,
      group: 'answers',
      onEnd: onListChange,
    });
  }, []);

  return (
    <>
      <div className="flex">
        <div className="w-full overflow-hidden">
          <div className="space-y-2" ref={propRef} id="propDemo">
            {optionLength.map((item, idx) => {
              return (
                <div
                  className="group w-full rounded-3xl"
                  key={`ArcComponentItemKey_${idx}`}
                  data-id={idx}
                >
                  <AddInput
                    key={`ArcComponentItemKey_${idx}`}
                    choice={idx + 1}
                    OptionLength={optionLength.length}
                    updateOptionLength={() => updateOptionLength(2, idx)}
                    handleChange={(e, name, key) => handleChangeMethod(e, name, key, idx)}
                    data={optionLength[idx]}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="ml-2 flex w-[48px] items-end">
          <button
            type="button"
            onClick={() => updateOptionLength(1)}
            className="flex h-[44px] !h-[42px] w-[44px] !w-[42px] cursor-pointer select-none items-center justify-center rounded-full border hover:border-skin-text"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default DraggableInput;
