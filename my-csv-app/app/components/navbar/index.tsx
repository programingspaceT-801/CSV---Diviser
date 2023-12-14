import { useState } from "react";

import iconsmenu from '../../../public/iconsmenu.png';
import iconsclose from '../../../public/iconsclose.png';

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-2 px-6 justify-between items-center navbar bg-white">
      <img src='/logo (1) (1).png' alt="hoobank" className="w-[70px] h-[auto]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
     
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? iconsclose : iconsmenu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-8 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
          
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;