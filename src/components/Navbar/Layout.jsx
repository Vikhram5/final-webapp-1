import React from 'react';
import Header from './Header'; // Assuming Header component is in Header.js
import Sidebar from './Sidebar'; // Assuming Sidebar component is in Sidebar.js

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
