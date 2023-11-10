import React, {useState} from 'react'

interface Props {
  information?: string;
  children?: any;
}

const LabelInput: React.FC<Props> = ({ information, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="mb-[2px] flex items-center gap-1 text-skin-text">
      {children}
    </span>
  );
};

export default LabelInput;
