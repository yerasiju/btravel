import Link from "next/link";

import {
  homeItems,
  blogItems,
  pageItems,
  dashboardItems,
} from "../../data/mainMenuData";
import {
  isActiveParent,
  isActiveLink,
  isActiveParentChaild,
} from "../../utils/linkActiveChecker";

import { usePathname } from "next/navigation";
import { useState } from "react";

const MainMenu = ({ style = "" }) => {
  const pathname = usePathname();

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>
        <li className={pathname === "/" ? "current" : ""}>
          <Link href="/">Home</Link>
        </li>
        {/* End home page menu */}

        <li className={pathname === "/hotel-list-v2" ? "current" : ""}>
          <Link href="/hotel-list-v2">Hotels</Link>
        </li>
        {/* End hotels menu item */}

        <li className={pathname === "/destinations" ? "current" : ""}>
          <Link href="/destinations">Destinations</Link>
        </li>
        {/* End destinations menu item */}

        <li className={pathname === "/blog-list-v1" ? "current" : ""}>
          <Link href="/blog-list-v2">Blog</Link>
        </li>
        {/* End blog menu */}

        <li className={pathname === "/about" ? "current" : ""}>
          <Link href="/about">About</Link>
        </li>
        {/* End about page */}

        <li className={pathname === "/contact" ? "current" : ""}>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainMenu;
