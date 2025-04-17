import { fetchCountries } from "../../../apis/countryModule";
import CustomHooks from "../../../common/hooks/CustomHooks";

export const useGetCountries = () => {
  return CustomHooks.useQuery(["countries"], fetchCountries);
};
