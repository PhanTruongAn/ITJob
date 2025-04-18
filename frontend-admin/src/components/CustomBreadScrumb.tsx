import React from "react";
import { Breadcrumb } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

type CrumbItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

type Props = {
  items: CrumbItem[];
};

export default function CustomBreadcrumbs({ items }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbItems = items.map((item) => ({
    title: (
      <>
        {item.icon && <span style={{ marginRight: 4 }}>{item.icon}</span>}
        {item.href ? (
          <span
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={() => {
              if (location.pathname !== item.href) {
                if (item.href) {
                  navigate(item.href);
                }
              }
            }}
          >
            {item.label}
          </span>
        ) : (
          <span style={{ color: "#999" }}>{item.label}</span>
        )}
      </>
    ),
  }));

  return (
    <div>
      <Breadcrumb
        separator="/"
        style={{
          background: "#fff",
          borderRadius: 8,
          fontSize: 14,
        }}
        items={breadcrumbItems}
      />
    </div>
  );
}
