import { useMemo } from 'react';

function SpaceProposalResultsProgressBar({ value, max }) {
  const bars = useMemo(() => {
    if (Array.isArray(value)) {
      return value.filter((bar) => bar !== 0);
    }
    return [value];
  }, [value]);

  return (
    <div className="relative flex h-2 overflow-hidden rounded-full">
      <div className="z-5 absolute h-full w-full bg-[color:var(--border-color)]" />
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{ width: `${((100 / max) * bar).toFixed(3)}%` }}
          className={`z-10 h-full bg-primary ${
            i === 1
              ? 'opacity-80'
              : i === 2
              ? 'opacity-60'
              : i === 3
              ? 'opacity-40'
              : i >= 4
              ? 'opacity-20'
              : ''
          }`}
        />
      ))}
    </div>
  );
}

export default SpaceProposalResultsProgressBar;