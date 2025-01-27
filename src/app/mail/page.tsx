"use client"
import React from "react";
import dynamic from "next/dynamic";
const Mail = dynamic(() => {
  return import('./components/Mail')
},{
  ssr:false
})
const MailDashboard = () => {
  return (
    <div>
      <Mail
        defaultCollapsed={false}
        collapSize={4}
        defaultLayout={[20, 32, 48]}
      />
    </div>
  );
};

export default MailDashboard;
