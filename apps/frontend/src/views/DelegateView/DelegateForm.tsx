import * as Yup from 'yup';
import { WarningIcon } from 'icons/Warning';
import ToggleActionSwitchInverted from 'components/ToggleActionSwitch/inverted';

export const validationSchema = Yup.object().shape({
  address: Yup.string().length(58, 'Address must be exactly 58 characters long'),
  space: Yup.string().when('isSpecifySpaceChecked', {
    is: true,
    then: Yup.string()
    .matches(/^[a-zA-Z0-9]*$/, {
      message: 'Space must contain only alphanumeric characters.',
    })
    .required('Please enter a valid space.'),
  }),
});

const DelegateForm = ({ formik, spaceKey, isSpecifySpaceChecked, setIsSpecifySpaceChecked }) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-2">
        <div className="w-full">
          <span className="mb-[2px] flex items-center gap-1 text-skin-text">Delegate address</span>
          <div className="group relative z-10">
            <input
              className={`${
                formik.touched.address && formik.errors.address ? '!border-red' : null
              } s-input !h-[42px]`}
              placeholder="e.g. K3NSXYMHPRCK7PMYT3QUQXUGPZJ4MKWJXW2HJRYPVMQUMKJAOJEIEO4HK4"
              name="address"
              id="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div
            className={`${
              formik.touched.address && formik.errors.address
                ? 's-error -mt-[21px] opacity-100'
                : 's-error -mt-[40px] h-6 opacity-0'
            }`}
          >
            {formik.errors.address ? (
              <>
                <WarningIcon  /> {formik.errors.address}
              </>
            ) : null}
          </div>
        </div>

        <div className="flex items-center space-x-2 px-2">
          <ToggleActionSwitchInverted
            defaultEnabled={!isSpecifySpaceChecked}
            action={() => {
              setIsSpecifySpaceChecked((prev) => {
                const newValue = !prev;
                formik.setFieldValue('isSpecifySpaceChecked', newValue);
                if (!newValue) {
                  formik.setFieldValue('space', '');
                  formik.setFieldTouched('space', false);
                } else {
                  formik.setFieldTouched('space', true);
                  formik.setFieldValue('space', spaceKey !== 'profileKey' ? spaceKey : '');
                }
                return newValue;
              });
            }}
          />
          <span> Limit delegation to a specific space</span>
        </div>
        {isSpecifySpaceChecked && (
          <div className="w-full">
            <span className="mb-[2px] flex items-center gap-1 text-skin-text">Space</span>
            <div className="group relative z-10">
              <input
                className={`${
                  formik.touched.space && formik.errors.space ? '!border-red' : null
                } s-input !h-[42px]`}
                placeholder="e.g. yamerz"
                name="space"
                id="space"
                value={formik.values.space}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div
              className={`${
                formik.touched.space && formik.errors.space
                  ? 's-error -mt-[21px] opacity-100'
                  : 's-error -mt-[40px] h-6 opacity-0'
              }`}
            >
              {formik.errors.space ? (
                <>
                  <WarningIcon  /> {formik.errors.space}
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default DelegateForm;
