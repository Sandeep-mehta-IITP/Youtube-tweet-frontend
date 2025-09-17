import React, { useRef } from "react";
import Logo from "../ui/Logo";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import { Search } from "lucide-react";
import Button from "../ui/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef();
  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-[#f6f5f6] bg-[#121212] px-4">
      <nav className="mx-auto flex items-center py-2 w-full">
        <Logo />

        {/* Search bar */}
        <form className="hidden w-full max-w-lg mx-auto sm:flex">
          <div className="flex w-full">
            {/* Input */}
            <div className="relative flex-1">
              <Input
                ref={searchInputRef}
                placeholder="Search"
                className="w-full bg-[#121212] border border-gray-600 rounded-l-full py-2 pl-12 pr-3 text-gray-100 font-medium text-lg outline-none sm:py-3 focus:border-blue-500"
              />

              {/* Left Icon */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-6 h-6 text-gray-400" />
              </span>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#1f1f1f] border border-gray-600 border-l-0 rounded-r-full px-5 flex items-center justify-center hover:bg-gray-700"
            >
              <Search className="w-6 h-6 text-white hover:text-blue-500" />
            </button>
          </div>
        </form>
      </nav>
    </header>
  );
};

export default Navbar;
