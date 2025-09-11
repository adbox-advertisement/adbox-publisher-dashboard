import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import {
  FiUpload,
  FiHome,
  FiFileText,
  FiBarChart,
  FiMessageCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { HiOutlineWallet } from "react-icons/hi2";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { Toaster } from "sonner";
export const Route = createRootRoute({
  component: () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
      <>
        <Toaster position="bottom-right" richColors />
        <div className="flex min-h-[100vh] max-w-[2000px] mx-auto">
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={toggleMobileMenu}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
            fixed md:relative top-0 left-0 h-full z-30
            flex flex-col min-w-[250px] w-[250px] 
            bg-white border-gray-200 border-r-[1px]
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
          >
            {/* Header */}
            <section className="border-b-[1px] border-gray-200 h-[70px] text-center flex justify-center items-center text-[20px] md:text-[28px] relative">
              <span className="truncate px-4 font-bold">Adbox studio</span>
              {/* Mobile close button */}
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 md:hidden p-2"
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <FiX className="w-6 h-6" />
              </button>
            </section>

            {/* Navigation */}
            <section className="mt-3 flex flex-col px-[10px] gap-6 md:gap-10 text-[16px] md:text-[18px] overflow-y-auto">
              {/* Upload Button */}
              <div className="mt-0.5 rounded-lg">
                <Link
                  to="/upload"
                  className="[&.active]:font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white px-4 py-2 rounded-lg text-center hover:shadow-lg hover:scale-105 transform transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUpload className="w-4 h-4" />
                  Upload
                </Link>
              </div>

              {/* Manage Section */}
              <main className="flex flex-col gap-2">
                <div className="text-[16px] md:text-[18px] font-medium text-gray-700">
                  Manage
                </div>
                <Link
                  to="/"
                  className="[&.active]:bg-gradient-to-r [&.active]:from-[#764ba2] [&.active]:to-[#667eea] [&.active]:text-white [&.active]:border-transparent border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gradient-to-r hover:from-[rgba(118,75,162,0.1)] hover:to-[rgba(102,126,234,0.1)] hover:border-[#764ba2] hover:text-[#764ba2] transition-all duration-200 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiHome className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  to="/posts"
                  className="[&.active]:bg-gradient-to-r [&.active]:from-[#764ba2] [&.active]:to-[#667eea] [&.active]:text-white [&.active]:border-transparent border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gradient-to-r hover:from-[rgba(118,75,162,0.1)] hover:to-[rgba(102,126,234,0.1)] hover:border-[#764ba2] hover:text-[#764ba2] transition-all duration-200 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiFileText className="w-4 h-4" />
                  Post
                </Link>

                <Link
                  to="/wallet"
                  className="[&.active]:bg-gradient-to-r [&.active]:from-[#764ba2] [&.active]:to-[#667eea] [&.active]:text-white [&.active]:border-transparent border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gradient-to-r hover:from-[rgba(118,75,162,0.1)] hover:to-[rgba(102,126,234,0.1)] hover:border-[#764ba2] hover:text-[#764ba2] transition-all duration-200 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HiOutlineWallet className="w-4 h-4" />
                  Wallet
                </Link>
                <Link
                  to="/Campaign"
                  className="[&.active]:bg-gradient-to-r [&.active]:from-[#764ba2] [&.active]:to-[#667eea] [&.active]:text-white [&.active]:border-transparent border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gradient-to-r hover:from-[rgba(118,75,162,0.1)] hover:to-[rgba(102,126,234,0.1)] hover:border-[#764ba2] hover:text-[#764ba2] transition-all duration-200 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HiOutlineWallet className="w-4 h-4" />
                  Create Campaign
                </Link>
                <Link
                  to="/survey"
                  className="[&.active]:bg-gradient-to-r [&.active]:from-[#764ba2] [&.active]:to-[#667eea] [&.active]:text-white [&.active]:border-transparent border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gradient-to-r hover:from-[rgba(118,75,162,0.1)] hover:to-[rgba(102,126,234,0.1)] hover:border-[#764ba2] hover:text-[#764ba2] transition-all duration-200 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HiOutlineClipboardDocumentList className="w-4 h-4" />
                  Survey
                </Link>

                <Link
                  to="/comments"
                  className="[&.active]:bg-gradient-to-r [&.active]:from-[#764ba2] [&.active]:to-[#667eea] [&.active]:text-white [&.active]:border-transparent border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gradient-to-r hover:from-[rgba(118,75,162,0.1)] hover:to-[rgba(102,126,234,0.1)] hover:border-[#764ba2] hover:text-[#764ba2] transition-all duration-200 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiMessageCircle className="w-4 h-4" />
                  Comments
                </Link>
                <Link
                  to="/analytics"
                  className="[&.active]:bg-gradient-to-r [&.active]:from-[#764ba2] [&.active]:to-[#667eea] [&.active]:text-white [&.active]:border-transparent border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gradient-to-r hover:from-[rgba(118,75,162,0.1)] hover:to-[rgba(102,126,234,0.1)] hover:border-[#764ba2] hover:text-[#764ba2] transition-all duration-200 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiBarChart className="w-4 h-4" />
                  View analytics
                </Link>
              </main>
            </section>
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col min-w-0">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-10 bg-white">
              <nav className="h-[70px] border-gray-200 border-b-[1px] flex items-center px-4">
                {/* Mobile hamburger menu */}
                <button
                  className="md:hidden p-2 -ml-2"
                  onClick={toggleMobileMenu}
                  aria-label="Open menu"
                >
                  <FiMenu className="w-6 h-6" />
                </button>
                {/* Spacer for mobile title */}
                <div className="md:hidden flex-1 text-center text-lg font-medium">
                  Adbox studio
                </div>

                {/* Logo - far right corner */}
                <div className="ml-auto flex items-center gap-2">
                  <div className="rounded-full bg-gradient-to-br from-[#764ba2] to-[#667eea] p-3 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white w-4 h-4"
                    >
                      <polygon points="6 3 20 12 6 21 6 3"></polygon>
                    </svg>
                  </div>
                  <span className="font-bold text-xl text-gray-900 hidden sm:block">
                    Adbox
                  </span>
                </div>
              </nav>
            </div>

            {/* Page Content */}
            <div className="flex-1 px-4 md:px-6 py-4">
              <Outlet />
            </div>
          </div>
        </div>

        {/* <TanStackRouterDevtools /> */}
      </>
    );
  },
});
