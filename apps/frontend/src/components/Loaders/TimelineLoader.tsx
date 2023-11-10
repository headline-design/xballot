export const TimelineLoader = () => (
    <div className="border-skin-border bg-skin-block-bg md:rounded-lg md:border">
      <div>
        <div className="block px-4 py-4">
          <div
            className="lazy-loading mb-2 rounded-md"
            style={{ width: "60%", height: 28 }}
          />
          <div
            className="lazy-loading rounded-md"
            style={{ width: "50%", height: 28 }}
          />
        </div>
      </div>
      <div className="relative">
        <div className="absolute h-[10px] w-[10px]" />
      </div>
    </div>
  )

  export const TimelineLoaderInner = () => (
    <div className="block px-4 py-4">
      <div
        className="lazy-loading mb-2 rounded-md"
        style={{ width: "60%", height: 28 }}
      />
      <div
        className="lazy-loading rounded-md"
        style={{ width: "50%", height: 28 }}
      />
    </div>
  )
