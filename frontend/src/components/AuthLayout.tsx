import { Outlet } from "react-router-dom";

import Logo from '@/assets/Logo.svg';

export const AuthLayout: React.VFC = () => {
  return (
    <div className="min-h-screen bg-primary">
      <div className="mx-auto max-w-lg">
        <div className="flex justify-center pt-[4rem] pb-[2rem] text-white">
          <Logo />
        </div>

        <Outlet />
      </div>
    </div>
  );
};
