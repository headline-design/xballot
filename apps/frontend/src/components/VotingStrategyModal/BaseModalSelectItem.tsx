import { Block } from 'components/BaseComponents/Block';
import BasePill from 'components/BaseComponents/BasePill';
import { CheckmarkIcon } from 'icons/Checkmark';

const BaseModalSelectItem = ({ selected = false, title, tag, description }) => {
  return (
    <Block
      className={`cursor-pointer transition-colors hover:border-skin-text ${
        selected ? '!border-skin-link' : ''
      }`}
    >
      <div className="relative inset-y-0 flex items-center">
        <div className={`w-full text-left ${selected ? 'pr-[44px]' : ''}`}>
          <div className="mb-2 flex items-center gap-2">
            <h3 className={`mb-0 truncate ${description ? 'mt-0' : ''}`}>{title}</h3>
            <BasePill>{tag}</BasePill>
          </div>
          <span className="text-skin-text">{description}</span>
        </div>
        {selected ? <CheckmarkIcon className="absolute right-0 text-md" /> : null}
      </div>
    </Block>
  );
};

export default BaseModalSelectItem;
