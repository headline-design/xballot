const BaseIndicator = ({ className }) => {
  return (
    <span className={`${className || 'inline-block h-[12px] w-[12px] rounded-full bg-primary'}`} />
  );
};

export default BaseIndicator;
