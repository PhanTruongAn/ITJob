import { useState } from "react";
import { fetchCountries } from "../../../apis/countryModule";
import CustomHooks from "../../../common/hooks/CustomHooks";
import axios from "axios";
import { signedUploadLogo } from "../../../apis/fileModule";
import { message } from "antd";

export const usePresignImage = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    let imageURL;
    const signResult = await signedUploadLogo();
    if (signResult.statusCode >= 400) {
      message.error("File/Image signed fail!");
    }
    if (!file) {
      message.error("The file/image is empty or invalid.");
    }
    try {
      const { apiKey, signature, timestamp, uploadUrl, uploadPreset } =
        signResult.data;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("upload_preset", uploadPreset);
      const dataUpload = await axios.post(`${uploadUrl}`, formData);
      if (dataUpload.status !== 200) {
        message.error("Upload file/image failed!");
      }
      imageURL = dataUpload.data.secure_url;
    } catch (error) {
      message.error("Upload file/image failed!");
    }

    setIsUploading(false);
    return imageURL;
  };
  return { handleUpload, isUploading };
};

export const useGetCountries = () => {
  return CustomHooks.useQuery(["countries"], fetchCountries);
};
