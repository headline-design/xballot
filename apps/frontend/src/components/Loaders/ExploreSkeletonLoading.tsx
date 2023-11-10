import React from 'react';

interface Props {
  isSpaces?: boolean;
}

const Skeleton: React.FC<Props> = ({ isSpaces }) => {
  return (
    <>
      {isSpaces ? (
        <div className="grid gap-4 opacity-40 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={i}
              className="min-h-[266px] animate-pulse bg-skin-border md:rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 opacity-40 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={i}
              className="min-h-[124px] animate-pulse bg-skin-border md:rounded-xl"
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Skeleton;