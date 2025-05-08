import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import {
  createCompany,
  deleteCompany,
  editCompany,
  getCompanyById,
} from "../../../apis/companyModule";
import { fetchCountries } from "../../../apis/countryModule";
import { signedUploadLogo } from "../../../apis/fileModule";
import CustomHooks from "../../../common/hooks/CustomHooks";
import { QUERY_KEYS } from "../../../common/queryKeys";
import { useUpdateState } from "../../../util/hooks";
import { CompanyState } from "./interface";

export const useCompanyState = () => {
  const [state, setState] = useState<CompanyState>({
    page: 1,
    pageSize: 5,
    total: 0,
    sort: undefined,
    loading: false,
    name: null,
    address: null,
    companySize: null,
    companyType: null,
    countryId: null,
    visibleDeleteModal: false,
    visibleEditModal: false,
    selectedCompany: undefined,
    selectedCompanyId: null,
    typeModal: "view",
  });

  const updateState = useUpdateState(setState);

  return { state, updateState };
};

export const usePresignImage = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadImageUrl, setUploadImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    let imageURL = uploadImageUrl;
    const signResult = await signedUploadLogo();
    if (signResult.statusCode >= 400) {
      message.error("File/Image signed fail!");
    }
    if (!file) {
      message.error("The file/image is empty or invalid.");
    }

    if (file && file !== selectedFile) {
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
      setUploadImageUrl(dataUpload.data.secure_url);
      setSelectedFile(file);
      // imageURL = dataUpload.data.secure_url;
    }

    setIsUploading(false);
    return imageURL;
  };
  return { handleUpload, isUploading };
};

export const useGetCountries = () => {
  return CustomHooks.useQuery(["countries"], fetchCountries);
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return CustomHooks.useMutation(createCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_MODULE] });
    },
  });
};

export const useDeleteCompany = () => {
  return CustomHooks.useMutation(deleteCompany);
};

export const useGetCompanyById = (id: number) => {
  return CustomHooks.useQuery([QUERY_KEYS.COMPANY_MODULE, id], () =>
    getCompanyById(id)
  );
};
export const useEditCompany = () => {
  const queryClient = useQueryClient();
  return CustomHooks.useMutation(editCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_MODULE] });
    },
  });
};
