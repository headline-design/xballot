import { Networks } from 'utils/constants/common';
import BasePill from 'components/BaseComponents/BasePill';

interface Props {
  strategies: any;
}

const SpaceAboutStrategiesList = ({ strategies }: Props) => {
  return (
    <>
      {strategies?.map((strategy: any, i: number) => (
        <div key={i} className="flex items-center justify-between border-b p-4 last:border-b-0">
          <div>
            <div className="flex items-center">
              <h3>{strategy?.text}</h3>
            </div>
            <div>{strategy?.title}</div>
          </div>
          <div>
            {strategy?.params?.symbol ||
              ('ALGO' && (
                <BasePill className="py-1">{strategy?.params?.symbol || 'ALGO'}</BasePill>
              ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default SpaceAboutStrategiesList;
