import BaseLink from 'components/BaseComponents/BaseLink';
import BaseMessageBlock from './BaseMessageBlock';

export const PowerWarning = ({ currentRound, endPoints, pipeState }) => (

  <BaseMessageBlock level="warning" >
        <div className="leading-5 ">
          Oops, it seems you don't have any voting power at block {Number(currentRound)}.{' '}
          <BaseLink link={endPoints.explorer + 'address/' + pipeState.myAddress}>
            Learn more
          </BaseLink>
        </div>


  </BaseMessageBlock>
);
