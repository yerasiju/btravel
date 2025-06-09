"use client";

import Link from "next/link";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { usePathname, useRouter } from "next/navigation";
import Social from "../common/social/Social";
import ContactInfo from "./ContactInfo";

const MobileMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <div className="pro-header d-flex align-items-center justify-between border-bottom-light">
        <Link href="/">
          <img src="/img/general/logo-dark.svg" alt="brand" />
        </Link>
        <div
          className="fix-icon"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="icon icon-close"></i>
        </div>
      </div>
      <Sidebar width="400" backgroundColor="#fff">
        <Menu>
          <MenuItem
            onClick={() => router.push("/")}
            className={pathname === "/" ? "menu-active-link" : ""}
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={() => router.push("/hotel-list-v2")}
            className={pathname === "/hotel-list-v2" ? "menu-active-link" : ""}
          >
            Hotels
          </MenuItem>
          <MenuItem
            onClick={() => router.push("/destinations")}
            className={pathname === "/destinations" ? "menu-active-link" : ""}
          >
            Destinations
          </MenuItem>
          <MenuItem
            onClick={() => router.push("/blog-list-v2")}
            className={pathname === "/blog-list-v2" ? "menu-active-link" : ""}
          >
            Blog
          </MenuItem>
          <MenuItem
            onClick={() => router.push("/about")}
            className={pathname === "/about" ? "menu-active-link" : ""}
          >
            About
          </MenuItem>
          <MenuItem
            onClick={() => router.push("/contact")}
            className={pathname === "/contact" ? "menu-active-link" : ""}
          >
            Contact
          </MenuItem>
        </Menu>
      </Sidebar>
      <div className="mobile-footer px-20 py-5 border-top-light"></div>
      <div className="pro-footer">
        <ContactInfo />
        <div className="mt-10">
          <h5 className="text-16 fw-500 mb-10">Follow us on social media</h5>
          <div className="d-flex x-gap-20 items-center">
            <Social />
          </div>
        </div>
        <div className="mt-20">
          <Link
            className=" button -dark-1 px-30 fw-400 text-14 bg-blue-1 h-50 text-white"
            href="/admin/login"
          >
            Become An Expert
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
