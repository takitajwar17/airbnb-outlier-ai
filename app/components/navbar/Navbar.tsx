"use client";

import Container from "../Container";
import Categories from "./Categories";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/app/types";

interface NavbarProps {
   currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
   console.log({ currentUser });

   return (
      <div className="fixed w-full bg-white z-10 shadow-sm">
         <div className="py-4 border-b-[1px]">
            <Container>
               <div className="flex flex-row items-center justify-between">
                  <div className="flex-shrink-0">
                     <Logo />
                  </div>
                  <div className="flex-grow flex justify-center">
                     <div className="w-full max-w-[400px]">
                        <Search />
                     </div>
                  </div>
                  <div className="flex-shrink-0">
                     <UserMenu currentUser={currentUser} />
                  </div>
               </div>
            </Container>
         </div>
         <Categories />
      </div>
   );
};
export default Navbar;
