import { Portal } from '@headlessui/react';
import { Block } from 'components/BaseComponents/Block';
import { useState, useEffect, useRef, ReactNode, MutableRefObject } from 'react';
import { useMediaQuery } from 'utils/useMediaQuery';
import BlockSpacesListButtonMore from './BlockSpacesListButtonMore';
import BlockSpacesListItem from './BlockSpacesListItem';
import BlockSpacesListSkeleton from './BlockSpacesListSkeleton';
import ModalSpaces from './ModalSpaces';

interface Props {
  spaces: any;
  domainType?: any;
  title: string;
  message?: string;
  loading?: boolean;
  gridRef?: MutableRefObject<any[]>;
  emptyContent: string;
  children?: ReactNode;
}

const BlockSpacesList = ({
  spaces,
  title,
  message,
  loading,
  gridRef,
  emptyContent,
  domainType,
}: Props) => {
  const [modalSpacesOpen, setModalSpacesOpen] = useState(false);

  const isXSmallScreen = useMediaQuery('(max-width: 420px)');
  const isSmallScreen = useMediaQuery('(max-width: 544px)');
  const isMediumScreen = useMediaQuery('(max-width: 768px)');

  const numberOfSpacesByScreenSize = useRef<number>(7);

  useEffect(() => {
    if (isXSmallScreen) {
      numberOfSpacesByScreenSize.current = 3;
    } else if (isSmallScreen) {
      numberOfSpacesByScreenSize.current = 4;
    } else if (isMediumScreen) {
      numberOfSpacesByScreenSize.current = 5;
    }
  }, [isXSmallScreen, isSmallScreen, isMediumScreen]);

  return (
    <div>
      <Block title={title} counter={spaces?.length} hideBottomBorder slim>
        <div className="border-t p-4">
          {loading ? (
            <BlockSpacesListSkeleton numberOfSpaces={numberOfSpacesByScreenSize.current} />
          ) : (
            <div className="flex justify-between">
              {spaces?.length === 0 ? (
                <>{emptyContent}</>
              ) : (
                <div className="flex w-full overflow-x-hidden">
                  {spaces?.slice(0, numberOfSpacesByScreenSize.current).map((space, i) => (
                    <div key={i} className="mx-2 min-w-[66px] max-w-[66px] text-center first:ml-0">
                      <BlockSpacesListItem space={space} domainType={domainType} />
                    </div>
                  ))}
                </div>
              )}
              {numberOfSpacesByScreenSize.current < spaces?.length && (
                <BlockSpacesListButtonMore onClick={() => setModalSpacesOpen(true)} />
              )}
            </div>
          )}
        </div>
      </Block>

      <ModalSpaces
        open={modalSpacesOpen}
        onClose={() => setModalSpacesOpen(false)}
        spaces={spaces}
        gridRef={gridRef}
        domainType={domainType}
      />
    </div>
  );
};

export default BlockSpacesList;
