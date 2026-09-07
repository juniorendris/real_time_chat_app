import {
  House,
  MessageSquareCheck,
  SquareArrowOutUpRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useGetOutgoing from "../hooks/useGetOutgoing";

function Sidebar() {
  const { sentRequest: requestData } = useGetOutgoing();

  const requestCount = requestData?.outGoingRequets?.length ?? 0;

  const MenuList = [
    { icon: House, path: "/", lable: "HomePage" },
    { icon: MessageSquareCheck, path: "/chat", lable: "ChatPage" },
    {
      icon: SquareArrowOutUpRight,
      path: "/requests",
      lable: "OutGoing Requests",
    },
  ];

  return (
    <ul className="menu w-full grow pt-5 space-y-4 is-drawer-close:mt-8">
      {MenuList.map((item) => {
        const Icon = item.icon;

        return (
          <li key={item.lable}>
            <NavLink
              to={item.path}
              data-tip={item.lable}
              className={({ isActive }) =>
                `flex items-center ${
                  isActive ? "text-info bg-info/10" : ""
                }`
              }
            >
              {item.lable === "OutGoing Requests" ? (
                <div className="indicator">
                  {requestCount > 0 && (
                    <span className="indicator-item badge badge-error badge-xs">
                      {requestCount}
                    </span>
                  )}

                  <Icon className="size-4 is-drawer-close:size-6" />
                </div>
              ) : (
                <Icon className="size-4 is-drawer-close:size-6" />
              )}

              <span className="is-drawer-close:hidden">
                {item.lable}
              </span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

export default Sidebar;