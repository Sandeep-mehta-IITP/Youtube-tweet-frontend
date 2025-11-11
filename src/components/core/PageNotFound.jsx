import React from "react";
import Page_Not_Found from "/PageNotFound.gif";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { ArrowLeft, Home } from "lucide-react";

function PageNotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 overflow-hidden relative mb-7">
      {/* Optional subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3b82f6,transparent_50%)] blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center space-y-12 py-12">
        {/* Main Heading - Bold & Elegant */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400">
              404
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-white">
            Page Not Found
          </p>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* High-quality GIF with glassmorphic card */}
        <div className="flex justify-center my-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-500"></div>
            <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-2xl">
              <div className="w-80 h-44 md:w-96  md:h-60 rounded-2xl overflow-hidden">
                <img
                  src={Page_Not_Found}
                  alt="404 Illustration"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Button className="px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 group">
            <Home className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            <Link to="/">Back to Home</Link>
          </Button>

          <Button
            variant="outline"
            className="px-8 py-3 text-lg font-semibold rounded-xl border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center gap-3 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span
              onClick={() => window.history.back()}
              className="cursor-pointer"
            >
              Go Back
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
