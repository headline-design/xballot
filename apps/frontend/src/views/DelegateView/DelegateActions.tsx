import { Block } from 'components/BaseComponents/Block';
import { Button } from 'components/BaseComponents/Button';

const DelegateActions = ({
  isValidForm,
  pipeState,
  openLoginModal,
  formikRef,
  delegatesLoading,
  navigate,
}) => {
  return (
    <Block>
      <Button
        className="button button--secondary mb-2 block w-full px-[22px] hover:brightness-95"
        onClick={() => navigate('/about')}
      >
        Learn more
      </Button>
      <Button
        disabled={delegatesLoading || !isValidForm || !pipeState.myAddress || !formikRef.current.values.address}
        className="button button--primary block w-full px-[22px] hover:brightness-95"
        primary
        onClick={
          pipeState.myAddress ? () => formikRef.current.handleSubmit() : () => openLoginModal()
        }
      >
        Delegate
      </Button>
    </Block>
  );
};

export default DelegateActions;
