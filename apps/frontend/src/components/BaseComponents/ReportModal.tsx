import { Fragment, useContext, useRef, useState } from 'react';
import { Button } from 'components/BaseComponents/Button';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import algosdk from 'algosdk';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { useAppSelector } from 'redux/hooks';
import FormikTextArea from 'views/SpaceView/SpaceForum/Components/FormikTextArea';
import { DisplayFormikState } from 'components/DisplayFormik';
import { Modal } from 'components/BaseComponents/Modal';
import DomainContext from 'contexts/DomainContext';

export default function ReportModal({
  targetArray,
  targetType,
  appId,
  onClose,
  isOpen,
  setIsOpen,
}) {
  const domainData = useContext(DomainContext);
  const reportRef = useRef(null);
  let rawSettings = false;
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { registrationLoading } = useAppSelector((state) => state.loaders);

  const [reportData, setReportData] = useState({
    type: 'report',
    properties: targetArray,
    entity: targetType,
    content: '',
  });

  const formik = useFormik({
    validationSchema: Yup.object({
      content: Yup.string()
        .min(35, 'Report should be at least 35 characters')
        .max(240, 'Report should not exceed 250 characters')
        .required('Please enter a valid report.'),
    }),
    initialValues: reportData,
    onSubmit: async (values, { setFieldValue }) => {
      setDisabled(true);
      const reportData = values;
      if (formik.isValid) {
        const handleReport = async (values) => {
          const { reportRef } = values;
          setLoading(true);
          setDisabled(true);
          let prime = domainData?.domain;

          if (prime) {
            let address = algosdk.getApplicationAddress(parseInt(appId));
            let txid = await Pipeline.send(
              address,
              0,
              JSON.stringify(formik.values),
              undefined,
              undefined,
              0,
            );
            if (txid) {
              toast.success('Report submitted successfully');
            } else {
              toast.error('Report failed to submit');
            }
            console.log('txid', txid);
            setLoading(false);
            setIsOpen(false);
          } else {
            toast.error(`XBallot domain required to report ${targetType}`);
            setLoading(false);
          }
        };
        await handleReport(reportData);
      } else {
        setShowLoader(true);
      }
    },
  });

  return (
    <>
      <Modal onClose={onClose} open={isOpen} title={'Report'}>
        <div className="modal-body">
          <div className="m-4">
            <div className="min-h-[150px] space-y-3">
              <div className="leading-5 sm:leading-6">
                <div>
                  <form onSubmit={formik.handleSubmit}>
                    <FormikTextArea
                      value={formik.values.content}
                      name={'content'}
                      formik={formik}
                      count={true}
                      maxLength={240}
                      title={undefined}
                      id={'content'}
                      errorTag={formik.touched.content && formik.errors.content}
                      errorField={formik.errors.content}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {rawSettings && <DisplayFormikState {...formik} />}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-3 top-[20px] flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
        >
          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="border-t p-4 text-center">
          <div className="float-left w-2/4 pr-2">
            <Button
              type="button"
              className="button button--secondary w-full px-[22px] hover:brightness-95"
              data-v-4a6956ba=""
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>{' '}
          <div className="float-left w-2/4 pl-2">
            <Button
              loading={loading}
              disabled={!(formik.dirty && formik.isValid) ? true : loading ? true : false}
              className="button button--primary w-full px-[22px] hover:brightness-95"
              data-v-4a6956ba=""
              type="button"
              onClick={formik.submitForm}
            >
              Report
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
