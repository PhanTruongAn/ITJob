import React from "react";
import CompanyListHeader from "./components/CompanyListHeader";
import { CompanyListHeaderToolbar } from "./components/CompanyListToolbar";
import { useCompanyState, useDeleteCompany } from "./common/hooks";
import CustomGlobalTable from "../../components/table";
import { IBackendPaginateRes, ICompany } from "../../types/backend";
import { companyColumns } from "./components/table/CompanyComlumns";
import { message, theme } from "antd";
import { fetchCompanies } from "../../apis/companyModule";
import CustomHooks from "../../common/hooks/CustomHooks";
import { IFilterCompany } from "./common/interface";
import { DEFAULT_STATE } from "./common/constants";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../routes/paths";
import { QUERY_KEYS } from "../../common/queryKeys";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { replacePathParamsWithQuery } from "../../common/utils/replaceParams";
const Company: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateState } = useCompanyState();
  const { mutate: deleteMutate, isPending: isDelete } = useDeleteCompany();
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

  const handleAddCompany = () => {
    navigate(PATH_DASHBOARD.companyManage.create);
  };
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
      QUERY_KEYS.COMPANY_MODULE,
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
  const confirmDeleteCompany = (id: number) => {
    updateState({ visibleDeleteModal: true, selectedCompanyId: id });
  };
  const handleDelete = () => {
    deleteMutate(
      { id: state.selectedCompanyId! },
      {
        onSuccess: async (result) => {
          const updatedData = await refetch();
          const resultLength = updatedData?.data?.data?.result?.length ?? 0;

          if (resultLength === 0 && state.page > 1) {
            updateState({ page: state.page - 1 });
          }

          message.success(result.message);
          updateState({
            visibleDeleteModal: false,
            selectedCompanyId: null,
          });
        },
        onError: () => {
          message.error("Error when deleted company");
          updateState({
            visibleDeleteModal: false,
            selectedCompanyId: null,
          });
        },
      }
    );
  };
  const handleEditUser = (record: ICompany) => {
    navigate(
      replacePathParamsWithQuery(PATH_DASHBOARD.companyManage.edit, {
        id: record.id,
      })
    );
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
      <ConfirmModal
        content="Are you sure you want to delete this company?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDelete}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm company deletion"
      />
      <div style={listStyle}>
        <div className="table-container">
          <CustomGlobalTable<ICompany>
            columns={companyColumns({
              onView: (record) => {
                // handleViewUser(record);
              },
              onEdit: (record) => {
                handleEditUser(record);
              },
              onDelete: (record) => {
                confirmDeleteCompany(record);
              },
            })}
            data={data?.data?.result || []}
            loading={state.loading}
            total={data?.data?.meta?.total || 0}
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
