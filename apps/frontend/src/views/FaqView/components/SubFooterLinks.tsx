export const SubFooterLinks = ({
  linksTitle,
  linkTitle1,
  link1,
  linkDescription1,
  linkDescription2,
  linkDescription3,
  linkTitle2,
  link2,
  linkTitle3,
  link3,
}) => {
  return (
    <>
      <h2 className="relative mt-[96px] ml-[50px] font-space text-lg font-bold tracking-wide ">
        <div className="absolute top-[12px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
        {linksTitle}{' '}
      </h2>

      <p className="mt-4 mb-[50px] pl-[50px] text-gray-300 !text-skin-text">
        {' '}
        {linkTitle1}{' '}
        <a
          href={link1}
          target="_blank"
          className="text-xballot whitespace-nowrap"
          rel="noopener noreferrer"
        >
          {' '}
          {linkDescription1}
        </a>
        <br /> {linkTitle2}{' '}
        <a
          href={link2}
          target="_blank"
          className="text-xballot whitespace-nowrap"
          rel="noopener noreferrer"
        >
          {' '}
          {linkDescription2}
        </a>
        <br /> {linkTitle3}{' '}
        <a
          href={link3}
          target="_blank"
          className="text-xballot whitespace-nowrap"
          rel="noopener noreferrer"
        >
          {' '}
          {linkDescription3}
        </a>
      </p>
    </>
  );
};
