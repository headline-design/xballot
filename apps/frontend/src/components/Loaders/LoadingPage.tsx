export default function PageLoader() {
  return (
    <>

    <div className="px-3 md:px-0">
      <div>
        <div className="space-y-3">
          <div
            className="lazy-loading rounded-md"
            style={{ width: "100%", height: 34 }}
          />
          <div
            className="lazy-loading rounded-md"
            style={{ width: "40%", height: 34 }}
          />
          <div
            className="lazy-loading rounded-md"
            style={{ width: 65, height: 28 }}
          />
        </div>
      </div>
    </div>
    <div className="space-y-4">
    </div>
    </>
  );
}
