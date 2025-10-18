import React, { useEffect, useRef, useState } from "react";
import Logo from "../ui/Logo";
import { Link, useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import {
  CircleUser,
  Hamburger,
  HamburgerIcon,
  History,
  LogOutIcon,
  Menu,
  Notebook,
  NotebookPenIcon,
  Plus,
  Search,
  Settings,
  TvMinimal,
  User,
  Video,
} from "lucide-react";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { toggleAside } from "@/app/Slices/uiSlice";
import { logoutUser } from "@/app/Slices/authSlice";

const Navbar = () => {
  let { userData, isAuthenticated } = useSelector((state) => state.auth);
  //console.log(userData)
  const navigate = useNavigate();
  const dipatch = useDispatch();
  const searchInputRef = useRef();
  const smallsearchInputRef = useRef();

  // const asideOpen = useSelector((state) => state.ui.asideOpen);

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const createDropdownRef = useRef();
  const userDropdownRef = useRef();

  const createDropdownHandler = () => {
    setCreateDropdownOpen(!createDropdownOpen);
  };

  const userDropdownHandler = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Dropdown Closer 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        createDropdownRef.current &&
        !createDropdownRef.current.contains(e.target)
      ) {
        setCreateDropdownOpen(false);
      }

      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search Query 
  const handleSearchQuery = (input) => {
    let searchQuery = input.trim();

    if (!searchQuery) {
      searchInputRef.current.focus();
      return;
    }

    navigate(`/results?search-query=${searchQuery}`);
  };


  // Logout Handler
  const logoutHandler = () => {
    dipatch(logoutUser())
    navigate("/")
  }

  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-gray-800 bg-[#121212] px-4 ">
      <nav className="mx-auto flex items-center py-2 w-full">
        <Menu
          className="w-6 h-6 text-[#f6f5f6] ml-8 cursor-pointer hidden sm:block"
          onClick={() => dipatch(toggleAside())}
        />
        <Logo className="-ml-2 sm:ml-4" />

        {/* Search bar */}
        <form
          className="hidden w-full max-w-lg mx-auto sm:flex"
          onSubmit={(event) => {
            event.preventDefault();
            handleSearchQuery(searchInputRef.current.value);
          }}
        >
          <div className="flex w-full">
            {/* Input */}
            <div className="relative flex-1">
              <Input
                ref={searchInputRef}
                placeholder="Search"
                className="w-full bg-[#121212] border border-gray-600 rounded-l-full py-2 pl-12 pr-3 text-gray-100 font-medium text-lg outline-none sm:py-3 focus:border-blue-500 focus:ring-1"
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

     
        {/* Mobile Search */}
        <div className="flex items-center sm:hidden ml-auto">
          {!mobileSearchOpen ? (
            <button onClick={() => setMobileSearchOpen(true)}>
              <Search className="w-6 h-6 text-gray-300" />
            </button>
          ) : (
            <div className="absolute inset-x-0 top-0 z-20 bg-[#121212] px-3 py-2">
              <form
                className="flex items-center w-full bg-[#1f1f1f] rounded-full px-3 py-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSearchQuery(smallsearchInputRef.current.value);
                  setMobileSearchOpen(false);
                }}
              >
                <Input
                  ref={smallsearchInputRef}
                  placeholder="Search..."
                  className="flex-1 bg-transparent border-none text-gray-100 placeholder-gray-400 focus:ring-0 focus:outline-none"
                />
                <button type="submit">
                  <Search className="w-5 h-5 text-gray-300  fixed top-7 right-20" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  className="text-gray-400 hover:text-white fixed right-9"
                >
                  ✕
                </button>
              </form>
            </div>
          )}
        </div>

        {/*  Create Button */}
        <div className="mr-16 hidden sm:block">
          {isAuthenticated && (
            <div className="relative" ref={createDropdownRef}>
              <button
                onClick={createDropdownHandler}
                className="flex items-center space-x-2 px-4 py-2 text-white rounded-full border border-gray-800 hover:bg-gray-700   transition-all duration-200 shadow-lg hover:shadow-xl transform"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Create</span>
              </button>
              {/* Create Dropdown */}
              <div
                id="create-dropdown"
                className={`absolute right-0 mt-2 w-48 bg-[#121212] rounded-md shadow-lg py-1 z-50 border border-gray-500 transition-all duration-200
                ${
                  createDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible translate-y-2"
                }`}
              >
                <Link className=" px-4 py-2 text-sm font-medium text-[#f6f5f6] active:text-blue-700 hover:bg-gray-700 flex items-center space-x-3 cursor-pointer">
                  <Video className="w-4 h-4" />
                  <span>Upload Video</span>
                </Link>
                <Link className="px-4 py-2 text-sm font-medium text-[#f6f5f6 active:text-blue-700 hover:bg-gray-700 flex items-center space-x-3 cursor-pointer">
                  <NotebookPenIcon className="w-4 h-4" />
                  <span>Create Post</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative ml-2 sm:mr-5" ref={userDropdownRef}>
          {userData ? (
            // LOGGED IN USER - Show Avatar
            <>
              <button
                onClick={userDropdownHandler}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700 "
              >
                {/* User Avatar */}
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 rounded-full object-cover" />
                )}
              </button>

              {/* User Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-[#121212] rounded-lg shadow-lg py-1 z-50 border border-gray-500 ${
                  isUserDropdownOpen
                    ? "opacity-100 visible transform translate-y-0"
                    : "opacity-0 invisible transform translate-y-2"
                } transition-all duration-200`}
              >
                <a
                  href="/profile"
                  className=" px-4 py-2 text-sm font-medium text-[#f6f5f6] hover:bg-gray-700 flex items-center space-x-3"
                >
                  <CircleUser className="w-5 h-5" />
                  <span>Your Profile</span>
                </a>

                <a
                  href="/"
                  className=" px-4 py-2 text-sm font-medium text-[#f6f5f6] hover:bg-gray-700 flex items-center space-x-3"
                >
                  <TvMinimal className="w-5 h-5" />
                  <span>Your channel</span>
                </a>
                <a
                  href="/"
                  className=" px-4 py-2 text-sm font-medium text-[#f6f5f6] hover:bg-gray-700 flex items-center space-x-3"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </a>
                <button className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500 hover:bg-opacity-10" onClick={logoutHandler}>
                  <LogOutIcon className="w-5 h-5 text-red-500 inline mr-2" />
                  Sign out
                </button>
              </div>
            </>
          ) : (
            // NOT LOGGED IN USER - Show User Icon + Sign In
            <Link to="/login">
              <div className="flex items-center space-x-1 p-2 rounded-full border border-gray-800 hover:bg-gray-700">
                {/* User Icon */}
                <button className="">
                  <CircleUser className="w-6 h-6 rounded-full object-cover" />
                </button>

                {/* Sign In Button */}
                <span className="hidden sm:inline-block px-2 text-sm font-medium text-[#f6f5f6] hover:text-[#fff] transition-colors duration-200">
                  Sign in
                </span>
              </div>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
