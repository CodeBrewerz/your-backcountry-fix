import { Form } from "remix";

const ActiveFilterSection = ({activeFilters}) => {
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Filters
          <span className="sr-only">, active</span>
        </h3>
        <div
          aria-hidden="true"
          className="hidden w-px h-5 bg-gray-300 sm:block sm:ml-4"
        />
        <div className="mt-2 sm:mt-0 sm:ml-4">
          <div className="-m-1 flex flex-wrap items-center">
            {activeFilters.length > 0 &&
              activeFilters.map((activeFilter) => (
                <span
                  key={activeFilter.value}
                  className="m-1 inline-flex rounded-full border border-gray-200 items-center py-1.5 pl-3 pr-2 text-sm font-medium bg-white text-gray-900"
                >
                  <span>{activeFilter.label}</span>
                  <Form replace method="post">
                    <input
                      type="hidden"
                      value={activeFilter.value}
                      name="activeFilterToRemove"
                    />
                    <input
                      type="hidden"
                      value={JSON.stringify(activeFilters)}
                      name="activeFilters"
                    />
                    <input
                      type="hidden"
                      name="_action"
                      value={`remove_filter`}
                    />
                    <button
                      type="submit"
                      className="flex-shrink-0 ml-1 h-4 w-4 p-1 rounded-full inline-flex text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                    >
                      <span className="sr-only">
                        Remove filter for {activeFilter.label}
                      </span>
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M1 1l6 6m0-6L1 7"
                        />
                      </svg>
                    </button>
                  </Form>
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveFilterSection;
