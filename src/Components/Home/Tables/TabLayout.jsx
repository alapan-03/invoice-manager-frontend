import React from "react";
import { Tabs, Tab } from "@mui/material";

const TabLayout = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div>
      {/* <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs> */}
      <div>{tabs[activeTab].content}</div>
    </div>
  );
};

export default TabLayout;


// import React, { useState } from "react";
// import "./Tables.css"; // Import the CSS for styling

// const TabLayout = ({ tabs }) => {
//   const [activeTab, setActiveTab] = useState(0);

//   return (
//     <div className="tab-layout">

//       <div className="tab-headers">
//         {/* {tabs.map((tab, index) => (
//           <div
//             key={index}
//             className={`tab-header ${activeTab === index ? "active" : ""}`}
//             onClick={() => setActiveTab(index)}
//           >
//             {tab.label}
//           </div>
//         ))} */}
//       </div>

//       <div className="tab-content">{tabs[activeTab].content}</div>
//     </div>
//   );
// };

// export default TabLayout;
