import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { uploadRecord } from 'views/SpaceView/SpaceCreate/proposalUtils';

export function useImageUpload() {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');

  const reset = () => {
    setIsUploadingImage(false);
    setImageUploadError('');
    setImageUrl('');
    setImageName('');
  };

  const upload = async (
    file,
    onSuccess: (image: { name: string; url: string }) => void
  ) => {
    reset();
    if (!file) return;
    setIsUploadingImage(true);
    const formData = new FormData();

    // TODO: Additional Validations - File Size, File Type, Empty File, Hidden File
    // TODO: Make this composable useFileUpload

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setImageUploadError('errors.unsupportedImageType');
      setIsUploadingImage(false);
      return;
    }
    formData.append('file', file);
    try {
      const receipt = await uploadRecord(formData);
      setImageUrl(`ipfs://${receipt.cid}`);
      setImageName(file.name);
      onSuccess({ name: file.name, url: imageUrl });
    } catch (err) {
      toast('somethingWentWrong');
      setImageUploadError(err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return {
    isUploadingImage,
    imageUploadError,
    image: {
      url: imageUrl,
      name: imageName
    },
    upload
  };
}
