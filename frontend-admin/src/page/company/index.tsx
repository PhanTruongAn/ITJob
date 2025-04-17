import React from "react";
import CompanyListHeader from "./components/CompanyListHeader";
import { CompanyListHeaderToolbar } from "./components/CompanyListToolbar";
import { useCompanyState } from "./common/hooks";
const Company: React.FC = () => {
  const { state, updateState } = useCompanyState();
  const handleFilter = () => {};
  const handleClearFilter = () => {};
  const handleRefresh = () => {};

  const handleAddCompany = () => {};
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
    </div>
  );
};

export default Company;
