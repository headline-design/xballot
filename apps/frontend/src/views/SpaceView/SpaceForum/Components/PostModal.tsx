import { Fragment, useRef, useState } from 'react';
import { shorten, shortenAddress } from 'helpers/utils';
import { Button } from 'components/BaseComponents/Button';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { getBalances } from 'utils/functions';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import algosdk from 'algosdk';
import { BoltPlus } from 'icons/BoltPlus';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import FormikTextArea from './FormikTextArea';
import { create } from 'ipfs-http-client';
import { Modal } from 'components/BaseComponents/Modal';

const infuraProjectId = '2DBKADXQkjmd1KDSg7kq4ext7D3';
const infuraProjectSecret = '08c9d9923e313326c20a3d163193ab60';

async function uploadRecord(object) {
  try {
    const auth =
      'Basic ' + Buffer.from(infuraProjectId + ':' + infuraProjectSecret).toString('base64');
    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });

    const returnedData = await client.add(Buffer.from(JSON.stringify(object)));
    console.log('Uploaded Record');
    console.log(returnedData);
    return returnedData;
  } catch (error) {
    console.log(error);
  }
}

export default function PostModal({ space, appId }) {
  const postRef = useRef(null);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  //console.log(postRef);

  const navigate = useNavigate();
  const [message, setMessage] = useState('step 1');
  const [showLoader, setShowLoader] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { registrationLoading } = useAppSelector((state) => state.loaders);

  const blastRef = useRef(null);

  function handleClose() {
    setShowLoader(false);
    window.location.reload();
  }

  const [blastData, setBlastData] = useState({
    content: '',
    appId: appId,
    hash: '',
    type: 'post',
  });

  const formik = useFormik({
    validationSchema: Yup.object({
      content: Yup.string()
        .min(5, 'Blast should be at least 5 characters')
        .max(240, 'Blast should not exceed 240 characters')
        .required('Please enter a valid Blast.'),
    }),
    initialValues: blastData,
    onSubmit: async (values, { setFieldValue }) => {
      setDisabled(true);
      const blastData = values;
      if (formik.isValid) {
        const handlePost = async (values) => {
          const { blastRef } = values;
          setLoading(true);
          setDisabled(true);
          let token = parseInt(space?.forum?.token) || 0;
          let tokenAmount = parseInt(space?.forum?.tokenAmount) || 1000000000000000;
          let balances = await getBalances(Pipeline.address, [token], false);
          //console.log('balances', balances);
          if ((token && balances.assets[token] >= tokenAmount) || !Pipeline.main) {
            let address = algosdk.getApplicationAddress(parseInt(appId));
            let response = await uploadRecord(formik.values);
            let txid = await Pipeline.send(address, 0, response.path, undefined, undefined, 0);
            toast.success('Transaction confirmed');
            console.log('txid', txid);
            setLoading(false);
            setIsOpen(false);
          } else {
            toast('You are too poor to Blast!');
            setLoading(false);
          }
        };
        await handlePost(blastData);
        const { forceStayOpen, open } = registrationLoading;
      } else {
        setShowLoader(true);
      }
    },
  });

  return (
    <>
      <div>
        <button
          className="button mt-2 inline-block h-full w-full whitespace-nowrap px-[24px] text-left hover:brightness-95 xs:w-auto sm:mr-2 md:ml-2 md:mt-0"
          data-v-4a6956ba=""
          type="button"
          onClick={openModal}
        >
          <span className="flex items-center gap-2 group-hover:hidden">
            <BoltPlus /> Blast
          </span>
        </button>
      </div>

      <Modal onClose={closeModal} open={isOpen} title={'Blast'}>
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

        <button
          onClick={closeModal}
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
              onClick={closeModal}
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
              Blast
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
