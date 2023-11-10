import { FC } from 'react';

interface BlockSpacesListSkeletonProps {
  numberOfSpaces: number;
}

const BlockSpacesListSkeleton: FC<BlockSpacesListSkeletonProps> = ({ numberOfSpaces }) => {
  return (
    <div className="justify-between flex w-full overflow-x-hidden">
      {[...Array(numberOfSpaces + 1)].map((_, index) => (
        <div key={index} className="animate-pulse mx-2 min-w-[66px] max-w-[66px] text-center first:ml-0">
          <div className="flex justify-center">
            <div className="flex rounded-full border p-[2px]">
              <div className="h-[48px] w-[48px] rounded-full bg-skin-border" />
            </div>
          </div>
          <div className="mt-[6px] h-[14px] w-[66px] rounded bg-skin-border" />
        </div>
      ))}
    </div>
  );
};

export default BlockSpacesListSkeleton;
