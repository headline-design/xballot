import { Block } from 'components/BaseComponents/Block';
import { ProposalReviewBody } from 'components/BaseComponents/ProposalsItem/ProposalsItemBody';
import { useMemo, useState } from 'react';
import { BaseMarkdown } from 'components/BaseComponents/BaseMarkdown';
import removeMd from 'remove-markdown';

export function ReviewForm({ formikValues, formData }) {
  const reviewBody = useMemo(() => removeMd(formikValues.content), [formikValues.content]);
  const [mdPreview, setMdPreview] = useState(false);

  const handleMdPreview = () => {
    setMdPreview(!mdPreview);
  };

  return (
    <Block
      title="Review proposal"
      buttonRight={
        <button onClick={handleMdPreview}>{!mdPreview ? 'View mardown' : 'View summary'}</button>
      }
    >
      {!mdPreview && (
        <ul>
          <li>
            <b>Title:</b> {formikValues.title}
          </li>
          <li>
            <b>Content:</b> {reviewBody && <ProposalReviewBody>{reviewBody}</ProposalReviewBody>}
          </li>
          <li>
            <b>Discussion:</b> {formikValues.discussion ? formikValues.discussion : 'Undefined'}
          </li>
          <li>
            <b>Token:</b> {formikValues.token}
          </li>
          <li>
            <b>Strategy Type:</b> {formikValues.strategyType.text}
          </li>
          <li>
            <b>Choices:</b>{' '}
            {formikValues.choices.map((choice, index) => (
              <span key={index}>
                {choice.choice}
                {index !== formikValues.choices.length - 1 ? ', ' : ''}
              </span>
            ))}
          </li>
          <li>
            <b>Start:</b> {new Date(formikValues.start * 1000).toLocaleString()}
          </li>
          <li>
            <b>End:</b> {new Date(formikValues.end * 1000).toLocaleString()}
          </li>
        </ul>
      )}
      {mdPreview && (
        <>
          <h1 className="mb-4 w-full break-all">{formikValues.title || 'Untitled'}</h1>
          <div className="min-h-[385px]">
            <BaseMarkdown source={formikValues.content} />
          </div>
        </>
      )}
    </Block>
  );
}
