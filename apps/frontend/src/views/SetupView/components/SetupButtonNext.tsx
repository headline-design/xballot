import BaseButton from "components/BaseComponents/BaseButton";

interface Props {
    primary?: boolean,
    loading?: boolean,
    onChange?: (value: any) => void,
    text?: string | any,
    nextStep?: any;
}
  
  const defaultProps: Props = {
    text: 'next'
  }


function SetupButtonNext(props: Props) {
    return( <BaseButton primary={defaultProps.text === 'next'} className="float-right mt-4" onChange={props.nextStep}>
        {props.text}
      </BaseButton>
    )
}

export default SetupButtonNext