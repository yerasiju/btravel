import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CategoriesMegaMenu = ({ setIsActiveParent }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("hotel-list-v2")) {
      setIsActiveParent(true);
    }
  }, [pathname]);

  return (
    <div className="mega__content">
      <ul className="mega__content">
        <li className="mega__grid">
          <div className="mega__item">
            <div className="text-15 fw-500">All Hotels</div>
            <div className="y-gap-5 text-15 pt-5">
              <div className={pathname === "/hotel-list-v2" ? "current" : ""}>
                <Link href="/hotel-list-v2">View All Hotels</Link>
              </div>
            </div>
          </div>
        </li>
        {/* End mega menu list left */}

        <li className="mega__image d-flex relative">
          <Image
            width={270}
            height={300}
            src="/img/backgrounds/7.png"
            alt="image"
            className="rounded-4 js-lazy"
          />

          <div className="absolute w-full h-full px-30 py-24">
            <div className="text-22 fw-500 lh-15 text-white">
              Find Your Perfect Stay
            </div>
            <Link
              href="/hotel-list-v2"
              className="button text-uppercase h-50 px-30 -blue-1 text-dark-1 bg-white mt-20 d-inline-flex"
            >
              Browse Hotels
            </Link>
          </div>
        </li>
        {/* End mega menu right images */}
      </ul>
    </div>
  );
};

export default CategoriesMegaMenu;
