import { Link, useLocation } from "remix";
import { useEffect, useState } from "react";
import { last } from "ramda";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "Sign In", href: "sign-in" },
  { name: "Create an Account", href: "sign-up" },
];

export default function Tabs() {
  const [currentTab, setCurrentTab] = useState("sign-up");
  const { pathname } = useLocation();

  useEffect(() => {
    let currentTab = last(pathname.split("/"));
    setCurrentTab(currentTab);
  }, [pathname]);

  return (
    <div className="mb-6">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          defaultValue={currentTab}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                className={classNames(
                  currentTab === tab.href
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm"
                )}
                aria-current={currentTab === tab.href ? "page" : undefined}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
