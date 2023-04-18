// import { useState } from 'react';
import { Outlet } from 'react-router-dom';

// import { useMe } from '@/hooks/queries';
// import { auth } from '@/utils/auth';
import * as React from 'react';


// const UserDropDown = () => {
//   const me = useMe();

//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <div className="relative">
//       <a className="block cursor-pointer mb-1" onClick={() => setOpen(!open)}>
//         {me.data!.email}
//       </a>
//       {open && (
//         <div className="absolute left-0 right-0 bg-white px-2 py-2 shadow rounded-md flex flex-col gap-y-2">
//           <button className="primary">Settings</button>
//           <button
//             className="primary"
//             onClick={() => {
//               auth.setToken(null);
//               navigate('/auth/login');
//             }}
//           >
//             Log out
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };


export const HomeLayout: React.VFC = () => {
  // const me = useMe();
  // const navigate = useNavigate();

  return (
    <Outlet/>
    
    // <div className="min-h-screen bg-primary px-4">
    //   <header className="mx-auto max-w-6xl text-white py-4">
    //     <div className="flex justify-end">
    //       {me.data && <UserDropDown />}
    //       {!me.data && (
    //         <>
    //           <a onClick={() => navigate('/auth/login')}>Log in</a>｜
    //           <a onClick={() => navigate('/auth/signup')}>Sign up</a>
    //         </>
    //       )}
    //     </div>

    //     <Logo />
    //   </header>
    //   <Outlet />
    // </div>
  );
};
