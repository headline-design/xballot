import React, { useEffect, useState } from 'react';
import Markdown from 'components/CreateProposalMarkdown';
import { useForm } from 'react-hook-form';
import { Formik, Field, Form } from 'formik';
import HiddenInput from 'components/Input/HiddenInput';
import { DisplayFormikState } from 'components/DisplayFormik';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import { create } from 'ipfs-http-client';
import { WalletWarning } from 'components/BaseComponents/WalletWarning';
import FormikInput from 'components/Input/FormikInput';
import * as Yup from 'yup';
import { Button } from 'components/BaseComponents/Button';
import { Sidebar } from './Components/CreatePostSidebar';
import algosdk from 'algosdk';
import { getBalances } from 'utils/functions';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { BackButton } from 'components/BaseComponents/BackButton';

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

const SpaceCreateForumPost = ({ domainData, space, appId, ...props }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { spaceKey } = useParams();
  const MarkdownForm = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const rawSettings = false;

  const [postData, setPostData] = useState({
    title: '',
    content: '',
    appId: appId,
    hash: '',
    type: 'post',
    timeStamp: Date.now(),
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const updateProposalSchema = Yup.object({
    title: Yup.string()
      .min(1, 'Title should be at least 1 characters')
      .max(38, 'Title should not exceed 30 characters')
      .required('Title is required'),
    content: Yup.string()
      .min(10, 'Content should be at least 5 characters')
      .max(500, 'Content should not exceed 14000 characters')
      .required('Content is required'),
  });

  const storedpostData = localStorage.getItem('postData');
  useEffect(() => {
    if (storedpostData) {
      setPostData(JSON.parse(storedpostData));
    } else {
      localStorage.setItem('postData', JSON.stringify(postData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('postData', JSON.stringify(postData));
  }, [postData]);

  let localContent;
  try {
    localContent = JSON.parse(localStorage.getItem('postData'))?.content;
  } catch (error) {
    console.error('No local form data found in local storage:', error);
    localContent = '';
  }

  const [formBody, setFormBody] = useState(localContent || '');
  const handleSaveDraft = () => {
    localStorage.setItem('postData', JSON.stringify(postData));
  };

  const handleAutoFill = () => {
    const savedDraft = localStorage.getItem('postData');
    setPostData(savedDraft ? JSON.parse(savedDraft) : postData);
  };
  const [preview, setPreview] = useState(false);
  const source = MarkdownForm.watch('content');
  const hash = postData.hash;
  const title = postData.title;

  useEffect(() => {
    if (storedpostData) {
      setPostData(JSON.parse(storedpostData));
    } else {
      localStorage.setItem('postData', JSON.stringify(postData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('postData', JSON.stringify(postData));
  }, [postData]);

  const handlePreview = () => {
    setPreview(!preview); // toggle markdown preview when the edit button is clicked
  };

  useEffect(() => {
    setPostData({ ...postData, content: source, title: postData.title, hash: hash });
  }, [source, hash]);

  useEffect(() => {
    setIsFormValid(false);
  }, []);

  return (
    <>
      <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
        <BackButton />
        {!Pipeline.address ? <WalletWarning aboutLink={`/${spaceKey}/about`} /> : null}
        <div>
          <Formik
            initialValues={postData}
            validationSchema={updateProposalSchema}
            onSubmit={undefined}
            validate={(values) => {
              const errors = {};
              if (!values.title) {
                errors.title = 'Title is required';
              }
              if (!values.content) {
                errors.content = 'Content is required';
              }
              setIsFormValid(Object.keys(errors).length === 0);
              return errors;
            }}
          >
            {(formik) => {
              const { values, touched, errors, dirty, isSubmitting, setFieldValue, handleChange } =
                formik;

              return (
                <Form>
                  <div className="mb-5 flex flex-col space-y-3 px-4 md:px-0">
                    <div className="w-full">
                      {!preview && (
                        <FormikInput
                          type="text"
                          name="title"
                          title="Title"
                          value={postData.title}
                          maxLength={38}
                          placeholder={undefined}
                          id={title}
                          count={true}
                          ref={undefined}
                          errorTag={formik.touched.title && formik.errors.title}
                          errorField={formik.errors.title}
                        />
                      )}
                    </div>
                    <Field name={'content'} className="group relative z-10">
                      {({ field, form }) => (
                        <Markdown
                          setFormBody={setFormBody}
                          formBody={formBody}
                          formikField={field}
                          formikForm={form}
                          preview={preview}
                          form={postData}
                          source={source}
                          Content={MarkdownForm.register('content')}
                          count={source.length}
                          handleChange={handleChange}
                          title={formik.values.title}
                        />
                      )}
                    </Field>
                  </div>

                  <HiddenInput
                    type="text"
                    id="appId"
                    name="appId"
                    title="App Id"
                    value={postData.appId}
                    onChange={handleChange}
                    maxLength={20}
                    placeholder={undefined}
                    checked={undefined}
                  />
                  <HiddenInput
                    type="text"
                    title="IPFS Hash"
                    name="hash"
                    value={postData.hash}
                    onChange={handleChange}
                    maxLength={20}
                    placeholder={undefined}
                    checked={undefined}
                    id={undefined}
                  />
                  {rawSettings && <DisplayFormikState {...formik} />}
                  <Sidebar
                    textPrimary={'Post'}
                    textSecondary={`${preview ? 'Edit' : 'Preview'}`}
                    handleSecondary={handlePreview}
                    disabled={!(formik.dirty && isFormValid) ? true : loading ? true : false}
                    handlePrimary={async (values) => {
                      setDisabled(true);
                      const postData = values;
                      if (isFormValid) {
                        const handlePost = async (values) => {
                          setLoading(true);
                          setDisabled(true);
                          let token = parseInt(space?.forum?.token) || 0;
                          let tokenAmount = parseInt(space?.forum?.tokenAmount) || 1000000000000000;
                          let balances = await getBalances(Pipeline.address, [token], false);
                          //console.log('balances', balances);
                          if ((token && balances.assets[token] >= tokenAmount) || !Pipeline.main) {
                            let address = algosdk.getApplicationAddress(parseInt(appId));
                            let response = await uploadRecord(formik.values);
                            let txid = await Pipeline.send(
                              address,
                              0,
                              response.path,
                              undefined,
                              undefined,
                              0,
                            );
                            toast.success('Transaction confirmed');
                            console.log('txId', txid);
                            setLoading(false);
                          } else {
                            toast('You are too poor to Post!');
                            setLoading(false);
                          }
                        };
                        await handlePost(postData);
                      } else {
                        setShowLoader(true);
                      }
                    }}
                    loading={loading}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>

      <div
        style={{ display: 'none' }}
        className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border lg:fixed lg:w-[320px]"
      >
        <div className="p-4 leading-5 sm:leading-6">
          <div className="space-y-2 md:flex md:space-x-3 md:space-y-0">
            <Button
              type="button"
              onClick={handleSaveDraft}
              className="button mb-2 block w-full px-[22px]"
              data-v-1b931a55
            >
              Save draft
            </Button>
            <Button
              type="button"
              onClick={handleAutoFill}
              className="button mb-2 block w-full px-[22px]"
              data-v-1b931a55
            >
              Load draft
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SpaceCreateForumPost;
