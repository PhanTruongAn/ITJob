import { useState } from "react";
import { useUpdateState } from "../../../util/hooks";
import { CompanyState } from "./interface";
import CustomHooks from "../../../common/hooks/CustomHooks";
import { fetchCountries } from "../../../apis/countryModule";
import { signedUploadLogo } from "../../../apis/fileModule";
import { message } from "antd";
import axios from "axios";
import {
  createCompany,
  deleteCompany,
  editCompany,
  getCompanyById,
} from "../../../apis/companyModule";
import {
  IBackendRes,
  ICompany,
  ICreateCompanyDTO,
} from "../../../types/backend";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../common/queryKeys";

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
