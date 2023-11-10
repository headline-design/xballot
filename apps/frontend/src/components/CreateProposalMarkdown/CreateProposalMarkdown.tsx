import React, { useState, useEffect, useRef } from 'react';
import { MarkdownEditor } from 'components/BaseComponents/MarkdownEditor';
import { BaseMarkdown } from 'components/BaseComponents/BaseMarkdown';
import { create } from 'ipfs-http-client';
import { getEndpoints } from 'utils/endPoints';

function Markdown({
  preview,
  count,
  Content,
  title,
  source,
  form,
  formBody,
  setFormBody,
  handleChange,
  formikField,
  formikForm,
}) {
  const endPoints = getEndpoints();
  const [ipfsImageLink, setIpfsImageLink] = useState('');
  const [displayImage, setDisplayImage] = useState<File | null>(null);

  const [hash, setHash] = useState('logo192.png');
  const infuraProjectId = '2DBKADXQkjmd1KDSg7kq4ext7D3';
  const infuraProjectSecret = '08c9d9923e313326c20a3d163193ab60';

  const appIdRef = useRef(null);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const handleImageUpload = async (e) => {
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
      const imageUrl = await client.add(e.target.files[0]);
      console.log(imageUrl);
      setDisplayImage(e.target.files[0]);
      setHash(imageUrl?.path);
      setIpfsImageLink(endPoints.ipfs + imageUrl?.path);
      setPreviewLoaded(true);
      injectImageToBody({
        name: e.target.files[0].name,
        url: endPoints.ipfs + imageUrl?.path,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const injectImageToBody = (image) => {
    setFormBody((prevFormBody) => {
      form.setFieldValue(formikField.name, prevFormBody + `\n![${image.name}](${image.url})`);
      return prevFormBody + `\n![${image.name}](${image.url})`;
    });
  };

  return (
    <>
      {!preview ? (
        <div>
          <MarkdownEditor
            id="description"
            setFormBody={setFormBody}
            value={formBody}
            onChange={handleChange}
            name="formbody"
            formikField={formikField}
            formikForm={formikForm}
            fileUpload={
              <input
                accept="image/jpg, image/jpeg, image/png"
                type="file"
                onChange={(e) => handleImageUpload(e)}
                className="absolute bottom-0 left-0 right-0 top-0 ml-0 w-full p-[5px] opacity-0"
              />
            }
            label="Description"
            {...Content}
            count={count}
          />
          <div style={{ display: 'none' }} className={'upload-box-1 position-relative minter-box'}>
            <div className="hover-div">
              {displayImage !== null ? (
                <div>
                  <img alt="not found" width={'250px'} src={URL.createObjectURL(displayImage)} />
                </div>
              ) : (
                <div>A Div</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="mb-4 w-full break-all">{title || 'Untitled'}</h1>
          <div className="min-h-[385px]">
            <BaseMarkdown source={source} />
          </div>
        </>
      )}
    </>
  );
}

export default Markdown;
