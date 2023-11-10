import React from 'react';
import { prettyRound } from '../../utils/functions';

interface IndicatorAssetsChangeProps {
  quote: number;
  quote24hPercentage: number;
  quoteOpen: number;
}

const IndicatorAssetsChange: React.FC<IndicatorAssetsChangeProps> = ({
  quote,
  quote24hPercentage,
  quoteOpen,
}) => {
  if (quote !== undefined && quote24hPercentage !== undefined && quoteOpen !== undefined) {
    const percentageChange = prettyRound(quote24hPercentage, 2);
    const dollarChange = prettyRound(quote - quoteOpen, 2);
    if (
      !isNaN(quote) &&
      !isNaN(quote24hPercentage) &&
      !isNaN(percentageChange) &&
      !isNaN(parseFloat(dollarChange))
    ) {
      return (
        <span
          data-testid="asset-quote-change"
          className={percentageChange < 0 ? 'text-red' : 'text-green'}
        >
          <span className="pr-1" data-testid="asset-quote-change-percent">
            {`${percentageChange < 0 ? '' : '+'}${percentageChange}%`}
          </span>
          <span data-testid="asset-quote-change-usd">{`($${dollarChange})`}</span>
        </span>
      );
    }
  }
};

export default IndicatorAssetsChange;
