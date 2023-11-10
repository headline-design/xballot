import FormikTextArea from 'views/SpaceView/SpaceForum/Components/FormikTextArea';

export const ModalVoteCommentForm = ({
proposal,
formik,
}) => {
    return (
      <>
        {proposal.privacy !== 'true' && proposal?.feedback === 'true' && (
          <div className="mb-4">
            <div className="flex">
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
            </div>
          </div>
        )}
      </>
    );
  };