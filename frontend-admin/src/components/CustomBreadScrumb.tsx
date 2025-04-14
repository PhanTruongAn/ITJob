import React from "react";
import { Breadcrumb } from "antd";

type CrumbItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

type Props = {
  items: CrumbItem[];
};

export default function CustomBreadcrumbs({ items }: Props) {
  const breadcrumbItems = items.map((item) => ({
    title: (
      <>
        {item.icon && <span style={{ marginRight: 4 }}>{item.icon}</span>}
        {item.href ? (
          <a href={item.href} style={{ color: "#1677ff" }}>
            {item.label}
          </a>
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
