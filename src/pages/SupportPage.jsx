import {
  FacebookIcon,
  GithubIcon,
  HelpCircleIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SupportPage = () => {
  const supportLinks = [
    {
      name: "LinkedIn",
      route: "https://www.linkedin.com/in/sandeep-mehta-90a1212b7",
      icon: <LinkedinIcon className="w-5 h-5" />,
    },
    {
      name: "GitHub",
      route: "https://github.com/Sandeep-mehta-IITP",
      icon: <GithubIcon className="w-5 h-5" />,
    },
    {
      name: "Instagram",
      route: "https://www.instagram.com/sandeep._mehta",
      icon: <InstagramIcon className="w-5 h-5" />,
    },
    {
      name: "Twitter",
      route: "https://twitter.com/Shivskm2023",
      icon: <TwitterIcon className="w-5 h-5" />,
    },
  ];

  return (
    <section className="w-full flex items-center justify-center">
      <div className="relative top-20 w-full max-w-2xl flex flex-col items-center text-center gap-y-5 px-4">
        <HelpCircleIcon className="w-16 h-16 mx-auto text-sky-600 animate-pulse text-center" />
        <p className="text-xl sm:text-2xl md:text-3xl mb-5 font-semibold text-slate-300 leading-relaxed">
          For any support or assistance, please don’t hesitate to contact
          me...💕
        </p>

        <div className="flex flex-col justify-center gap-6">
          {supportLinks.map((link) => (
            // rel for secure & private
            <Link
              key={link.name}
              to={link.route}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 px-6 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold transition"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportPage;
