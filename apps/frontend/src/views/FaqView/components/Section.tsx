export function Section({ title, descriptionPart1, descriptionPart2, showMore, toggleShowMore }) {
    return (
      <>
        <h2 className="relative mt-[96px] ml-[50px] font-space text-lg font-bold tracking-wide">
          <div className="absolute top-[22px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
          {title}
        </h2>
        {showMore ? (
          <>
            <p className="mt-4 mb-4 pl-[50px] text-gray-300 !text-skin-text sm:w-[501px]">
              {descriptionPart1}
            </p>
            <p className="mb-[50px] pl-[50px] text-gray-300 !text-skin-text sm:w-[501px]">
              {descriptionPart2}
            </p>
          </>
        ) : (
          <p className="mt-4 mb-[50px] pl-[50px] text-gray-300 !text-skin-text sm:w-[501px]">
              {descriptionPart1}
              {descriptionPart1.length > 200 && (
              <button
                  onClick={toggleShowMore}
                  className="mt-2 block text-sm font-bold leading-6 text-skin-text hover:text-skin-link active:text-skin-link"
              >
                  View More
              </button>
              )}
          </p>
        )}
      </>
    );
  }
