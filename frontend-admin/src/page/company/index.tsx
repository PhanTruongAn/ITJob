import React from "react";
import CompanyListHeader from "./components/CompanyListHeader";
import { CompanyListHeaderToolbar } from "./components/CompanyListToolbar";
import { useCompanyState } from "./common/hooks";
import CustomGlobalTable from "../../components/table";
import { IBackendPaginateRes, ICompany } from "../../types/backend";
import { companyColumns } from "./components/table/CompanyComlumns";
import { message, theme } from "antd";
import { fetchCompanies } from "../../apis/companyModule";
import CustomHooks from "../../common/hooks/CustomHooks";
import { IFilterCompany } from "./common/interface";
import { DEFAULT_STATE } from "./common/constants";
const Company: React.FC = () => {
  const { state, updateState } = useCompanyState();
  const { token } = theme.useToken();
  const handleFilter = ({
    name,
    address,
    companySize,
    companyType,
    countryId,
  }: IFilterCompany) => {
    updateState({ name, address, companySize, companyType, countryId });
  };
  const handleClearFilter = () => {
    updateState(DEFAULT_STATE);
  };
  const handleRefresh = () => {};

  const handleAddCompany = () => {};
  const handleTableChange = (page: number, pageSize: number, sort?: string) => {
    updateState({ page, pageSize, sort });
  };

  const fetchDataCompanies = async (): Promise<
    IBackendPaginateRes<ICompany[]>
  > => {
    const res = await fetchCompanies({
      page: state.page,
      pageSize: state.pageSize,
      name: state.name || null,
      sort: state.sort,
      address: state.address || null,
      companySize: state.companySize || null,
      companyType: state.companyType || null,
      countryId: state.countryId || null,
    });
    if (res?.statusCode >= 400) {
      message.error(res?.error);
    } else {
      updateState({ total: res.data.meta.total });
    }
    return res;
  };
  const { data, refetch } = CustomHooks.useQuery<
    IBackendPaginateRes<ICompany[]>
  >(
    [
      "users",
      state.page,
      state.pageSize,
      state.sort,
      state.name,
      state.address,
      state.companySize,
      state.companyType,
      state.countryId,
    ],
    fetchDataCompanies
  );
  const listStyle: React.CSSProperties = {
    display: "flex",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 13,
    flexDirection: "column",
  };
  return (
    <div>
      <CompanyListHeader
        onAddCompany={handleAddCompany}
        onRefresh={handleRefresh}
        loading={state.loading}
      />
      <CompanyListHeaderToolbar
        onClear={handleClearFilter}
        onFilter={handleFilter}
      />
      <div style={listStyle}>
        <div className="table-container">
          <CustomGlobalTable<ICompany>
            columns={companyColumns({
              onView: (record) => {
                // handleViewUser(record);
              },
              onEdit: (record) => {
                // handleEditUser(record);
              },
              onDelete: (record) => {
                // confirmDeleteUser(record);
              },
            })}
            data={data?.data?.result || []}
            loading={state.loading}
            total={state.total}
            page={state.page}
            pageSize={state.pageSize}
            onTableChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Company;
