import { staticEndpoints } from "utils/endPoints";

export const SettingsAvatar = ({
  displayAvatar,
  spaceData,
  handleCoverFileChange,
  setFieldValue,
  name,
}) => (
  <>
    <div>
      <div className="relative">
        <span className="flex shrink-0 items-center justify-center">
          <img
            className="rounded-full bg-skin-border object-cover"
            alt="avatar"
            style={{ width: 80, height: 80, minWidth: 80, display: 'none' }}
          />
          <img
            src={
              displayAvatar
                ? URL.createObjectURL(displayAvatar)
                : spaceData
                ? spaceData
                : `${staticEndpoints.stamp}avatar/algo:0x79d60b8f01bd9c06634223b46E4577e38F7d778D?s=160`
            }
            className="rounded-full bg-skin-border object-cover"
            alt="avatar"
            style={{ width: 80, height: 80, minWidth: 80 }}
          />
          {/**/}
        </span>
        <div className="group absolute bottom-0 left-0 right-0 top-0 flex cursor-pointer items-center justify-center rounded-full transition-colors ease-out hover:bg-skin-border hover:opacity-80">
          <div className="hidden transition-all ease-out group-hover:block">Upload</div>
          <input
            className="rounded-full"
            type="file"
            name={name || 'avatar'}
            accept="image/*"
            id="avatar"
            style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }}
            onChange={(event) => handleCoverFileChange(event, setFieldValue)}
          />
        </div>
        <div className="absolute bottom-[2px] right-0 rounded-full bg-skin-heading p-1">
          <svg
            viewBox="0 0 24 24"
            width="1.2em"
            height="1.2em"
            className="text-skin-bg-4 text-[12px]"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732Z"
            />
          </svg>
        </div>
      </div>
    </div>
  </>
);
