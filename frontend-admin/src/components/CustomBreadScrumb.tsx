import React from "react";
import { Breadcrumb } from "antd";

type CrumbItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

type Props = {
  // title: string;
  items: CrumbItem[];
};

export default function CustomBreadcrumbs({ items }: Props) {
  return (
    <div>
      <Breadcrumb
        separator="/"
        style={{
          // padding: "12px 24px",
          background: "#fff",
          borderRadius: 8,
          fontSize: 14,
        }}
      >
        {items.map((item, idx) => (
          <Breadcrumb.Item key={idx}>
            {item.icon && <span style={{ marginRight: 4 }}>{item.icon}</span>}
            {item.href ? (
              <a href={item.href} style={{ color: "#1677ff" }}>
                {item.label}
              </a>
            ) : (
              <span style={{ color: "#999" }}>{item.label}</span>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
}
