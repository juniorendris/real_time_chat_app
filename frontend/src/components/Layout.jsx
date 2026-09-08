// import React from 'react'
import { Outlet, Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import useGetIncomming from "../hooks/useGetIncomming";
import useMutateQuery from "../hooks/useMutateQuery";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Loading from "./Loading";
import { clearAccessToken } from "../api/api";
import { LogOut, CircleUserRound, Bell } from "lucide-react";
import Themes from "./Themes";
function Layout() {
  const { data: requesedList } = useGetIncomming();
  const friendRegests = requesedList?.friendRegests || [];
  const navigate = useNavigate();
  const { data } = useAuthUser();
  const { mutate, isPending } = useMutateQuery({
    method: "POST",
    url: "/auth/sign_out",
  });
  if (isPending) {
    return <Loading />;
  }
  const logoutHandler = () => {
    mutate(undefined, {
      onSuccess: () => {
        clearAccessToken();
        navigate("/login", { replace: true });
      },
    });
  };
  //requests notification

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle inline"
      />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300 sticky top-0 z-40">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost drawer-button"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <img
            src="/logo.png"
            alt="wollo connection"
            className="w-50 lg:hidden"
          />
          <div className="px-4 flex ms-auto gap-4">
            {friendRegests.length > 0 ? (
              <button className="btn indicator btn-circle">
                <Link to="/notifications">
                  <span className="indicator-item badge badge-error badge-xs rounded-2xl">
                    {friendRegests.length > 99 ? "99+" : friendRegests.length}
                  </span>
                  <Bell className="size-5" />
                </Link>
              </button>
            ) : (
              <button className="btn  btn-circle">
                <Link to="/notifications">
                  <Bell size={20} />
                </Link>
              </button>
            )}
            <Themes />
          </div>
        </nav>
        {/* Page content here */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side z-50 is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-300 is-drawer-close:w-16 is-drawer-open:w-64 is-drawer-open:px-3 py-3">
          <img
            src="/logo.png"
            alt="wollo connection"
            className="h-33 w-50 is-drawer-close:hidden sm:hidden md:hidden lg:block"
          />
          <img
            src="/miniLogo.png"
            alt="wollo connection"
            className="h-12 w-15 is-drawer-open:hidden sm:hidden md:hidden lg:block "
          />
          {/* Sidebar content here */}
          <Sidebar />
          <div className="dropdown dropdown-hover dropdown-top w-full">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300 w-full"
            >
              <div
                className={`avatar ${navigator.onLine ? "avatar-online" : "avatar-offline"}`}
              >
                <div className=" rounded-full">
                  <img
                    src={data?.user?.image}
                    alt="profile"
                    className="w-12 h-12  rounded-full object-cover is-drawer-close:ms-end"
                  />
                </div>
              </div>

              <div className="is-drawer-close:hidden">
                <p className="font-semibold">{data?.user?.fullName}</p>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow"
            >
              <li>
                <a>
                  <CircleUserRound size={20} />
                  {data.user.fullName}
                </a>
              </li>
              <li>
                <a onClick={logoutHandler}>
                  <LogOut size={20} />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
