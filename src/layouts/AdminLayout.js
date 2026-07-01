import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../context/AppContext';

const AdminLayout = () => {
  const { sidebarOpen } = useAppContext();

  // Desktop: locked to viewport. Mobile/tablet: scrollable
  return (
    <div className="min-h-screen lg:h-screen bg-page text-white lg:overflow-hidden">
      <div className="flex min-h-screen lg:h-full w-full">
        <Sidebar />
        <div className={`flex-1 flex flex-col min-w-0 lg:h-full transition-all duration-300 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'} pl-0`}>
          <div className="sticky top-0 z-30 bg-page/80 backdrop-blur-md shrink-0">
            <Header />
          </div>
          {/* Mobile/tablet: auto scroll. Desktop: overflow-hidden fills remaining height */}
          <main className="relative flex-1 px-3 pt-2 pb-2 sm:px-4 lg:px-6 overflow-y-auto lg:overflow-hidden lg:min-h-0">
            <div className="absolute inset-0 pointer-events-none bg-dashboard-gradient opacity-60"></div>
            <div className="relative z-10 lg:h-full">
              <Outlet />
            </div>
          </main>
          <Footer />
          <ToastContainer position="top-right" theme="dark" autoClose={3000} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
