import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import PrevNextLinks from '../components/PrevNextLinks';
import ControllerModal from 'components/SetupControllerModal';
import ToggleActionSwitch from 'components/ToggleActionSwitch';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import toast from 'react-hot-toast';
import { shorten } from 'helpers/utils';
import { NoticeIcon } from 'icons/NoticeIcon';
import { WarningIcon } from 'icons/Warning';
import { DisplayFormikState } from 'components/DisplayFormik';

const validationSchema = Yup.object().shape({
  controller: Yup.string().length(58, 'Controller must be exactly 58 characters long'),
});

export default function SetupController({ ticket }) {
  const [isToggled, setIsToggled] = useState();
  const [txId, setTxId] = useState(null);

  function closeModal() {
    setIsOpen(false);
    setModalLoading(false);
  }

  function openModal() {
    setIsOpen(true);
    setModalLoading(true);
  }

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [onController, setOnController] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const setControl = async (values) => {
    console.log(values.controller);

    setLoading(true);
    let txId = await Pipeline.appCall(parseInt(ticket?.appId), ['control'], [values.controller]);
    toast(txId ? shorten(txId) : 'Transaction cancelled');
    setTxId(txId);
    setOnController(true);
    setIsOpen(false);
    setLoading(false);
    setModalLoading(false);
  };

  const rawSettings = false

  return (
    <>
      <Formik
        initialValues={{ controller: '' }}
        validationSchema={validationSchema}
        onSubmit={setControl}
      >
        {(formik) => (
          <>
            <Form>
              <div>
                <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
                  <div className="group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-4 pb-[12px] pt-3 md:rounded-t-lg">
                    <h4 className="flex items-center">
                      <div>Space controller</div>
                    </h4>
                    <div className="flex items-center"></div>
                  </div>

                  <div className="p-4 leading-5 sm:leading-6">
                    <div className="mb-4">
                      <div className="rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
                        <div className="p-4 leading-5 sm:leading-6">
                          <div>
                            <NoticeIcon />
                            <div className="leading-5">
                              The space controller is the account that will be able to manage the
                              space settings. Additional space controllers (admins) can be added
                              later.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                        Delegate controller
                      </span>
                      <div className="group relative z-10">
                        <input
                          className={`${
                            formik.touched.controller && formik.errors.controller
                              ? '!border-red'
                              : null
                          } s-input !h-[42px]`}
                          placeholder="e.g. K3NSXYMHPRCK7PMYT3QUQXUGPZJ4MKWJXW2HJRYPVMQUMKJAOJEIEO4HK4"
                          name="controller"
                          id="controller"
                          value={formik.values.controller}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>

                      <div
                        className={`${
                          formik.touched.controller && formik.errors.controller
                            ? 's-error -mt-[21px] opacity-100'
                            : 's-error -mt-[40px] h-6 opacity-0'
                        }`}
                      >
                        {formik.errors.controller ? (
                          <>
                            <WarningIcon  /> {formik.errors.controller}
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <ToggleActionSwitch
                        onClickAction={() => {
                          formik.setFieldValue(
                            'controller',
                            isToggled === true ? '' : Pipeline.address,
                          );
                          formik.setFieldTouched('controller', true);
                        }}
                        action={() => {
                          setIsToggled(!isToggled);
                        }}
                      />
                      <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                        {' '}
                        <span> Use currently logged in account </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 leading-5 sm:leading-6">
                <ControllerModal
                  appId={ticket?.appId}
                  domain={ticket?.domain}
                  disabled={formik.values.controller ? !formik.isValid : formik.isValid}
                  address={Pipeline.address}
                  setControl={setControl}
                  modalLoading={modalLoading}
                  loading={loading}
                  openModal={openModal}
                  closeModal={closeModal}
                  isOpen={isOpen}
                  formik={formik}
                  refSubmit={undefined}
                  values={formik.values.controller}
                />

                <PrevNextLinks
                  isValid={onController ? formik.isValid : !formik.isValid}
                  domain={ticket?.appId}
                />
              </div>
            </Form>
            {rawSettings && <DisplayFormikState {...formik} />}
          </>
        )}
      </Formik>
    </>
  );
}
