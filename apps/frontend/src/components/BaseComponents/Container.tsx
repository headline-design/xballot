import clsx from 'clsx';
import { ReactNode } from 'react';

export const Container = ({
  slim = true,
  className = '',
  classNameT1 = '',
  children,
}: {
  slim?: boolean;
  className?: string;
  children: ReactNode;
  classNameT1?: string;
}) => {
  return (
    <>
      <div id="content" className={classNameT1 ? classNameT1 : "pb-6 pt-4"}>
        <div className={clsx(slim ? 'px-0 md:px-4' : 'px-4', 'mx-auto max-w-[1012px]', className)}>
          {children}
        </div>
      </div>
    </>
  );
};
