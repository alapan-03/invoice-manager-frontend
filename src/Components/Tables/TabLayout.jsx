import React from "react";
import { Tabs, Tab } from "@mui/material";

const TabLayout = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      <div>{tabs[activeTab].content}</div>
    </div>
  );
};

export default TabLayout;
