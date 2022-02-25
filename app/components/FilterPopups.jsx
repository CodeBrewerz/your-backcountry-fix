import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useSubmit, useFetcher } from "remix";

const FilterPopups = ({ filters }) => {
  const fetcher = useFetcher();
  const submit = useSubmit();
  return (
    <div className="hidden sm:block ">
      <div className="flow-root">
        <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
          {/* form input fields get changed on click of popover,
     form submission need to contain all inputs for all groups in one big form */}
          <fetcher.Form
            replace
            method="get"
            onChange={(e) => {
              submit(e.currentTarget);
            }}
            className="space-y-4"
          >
            {filters.map((section, sectionIdx) => (
              <Popover
                key={section.name}
                className="px-4 relative inline-block text-left"
              >
                <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span>{section.name}</span>
                  {sectionIdx === 0 ? (
                    <span className="ml-1.5 rounded py-0.5 px-1.5 bg-gray-200 text-xs font-semibold text-gray-700 tabular-nums">
                      1
                    </span>
                  ) : null}
                  <ChevronDownIcon
                    className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Popover.Panel className="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={section.name}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </Popover.Panel>
                </Transition>
              </Popover>
            ))}
          </fetcher.Form>
        </Popover.Group>
      </div>
    </div>
  );
};

export default FilterPopups;
