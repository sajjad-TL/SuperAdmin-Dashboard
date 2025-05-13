// src/components/Layout.jsx
import Sidebar from '../pages/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-[13.5rem]"> {/* md:ml-64 matches sidebar width */}
        <Outlet />
      </main>
    </div>
  );
}
