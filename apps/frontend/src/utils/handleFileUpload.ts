import { create } from 'ipfs-http-client';
import { getEndpoints } from 'utils/endPoints';

const handleFileUpload = async (
  e,
  setFieldValue,
  setDisplayAvatar,
  setHash,
  setIpfsImageLink,
  setSelectedAvatar,
  fieldName,
  handleStateUpdate
) => {
  const endPoints = getEndpoints();
  const infuraProjectId = '2DBKADXQkjmd1KDSg7kq4ext7D3';
  const infuraProjectSecret = '08c9d9923e313326c20a3d163193ab60';
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
    setDisplayAvatar(e.target.files[0]);
    setHash(imageUrl?.path);
    setIpfsImageLink(endPoints.ipfs + imageUrl?.path);

    // Call the callback function if it's provided
    if (handleStateUpdate) {
      handleStateUpdate(endPoints.ipfs + imageUrl?.path);
    }

    // Set the value of the specified field in the form
    setFieldValue(fieldName, endPoints.ipfs + imageUrl?.path);
    setSelectedAvatar(endPoints.ipfs + imageUrl?.path);
  } catch (error) {
    console.log(error);
  }
};

export default handleFileUpload;
