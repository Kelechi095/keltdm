import { LiaTimesSolid } from "react-icons/lia";
import { filterStatus, sortButtons } from "../utils/buttons";
import { useEffect, useState } from "react";

export default function Sidebar({
  toggleSidebar,
  isOpen,
  searchQuery,
  setSearchQuery,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortTerm, setSortTerm] = useState("");
  const [statusTerm, setStatusTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    if (!sortTerm) {
      urlParams.set("sort", "All");
    } else {
      urlParams.set("sort", sortTerm);
    }

    if (!statusTerm) {
      urlParams.set("status", "All");
    } else {
      urlParams.set("status", statusTerm);
    }

    console.log(statusTerm)

    setSearchQuery(urlParams.toString());
  }, [sortTerm, statusTerm]);

  console.log(searchQuery);

  return (
    <div
      className={
        isOpen ? "inset-0 fixed  bg-black bg-opacity-10 min-h-screen z-10" : ""
      }
      onClick={toggleSidebar}
    >
      <nav
        className={
          isOpen
            ? "w-[300px] bg-white py-4 px-4 text-[13px]  shadow-md h-full top-0 left-0 fixed"
            : "w-[300px] bg-white py-4 px-4 text-[13px]  shadow-md h-full top-0 -left-96 fixed"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 items-center mb-2">
          {
            <LiaTimesSolid
              size={25}
              className="cursor-pointer"
              onClick={toggleSidebar}
            />
          }
          <h1 className="font-bold text-xl font-mono">Library</h1>
        </div>

        <button className="font-semibold text-base text-blue-500 my-2">
          Home
        </button>
        <div className="mt-1 py-1">
          <p className="font-semibold my-2">Sort by</p>
          {sortButtons.map((button, index) => (
            <div key={index}>
              <button className="my-2" onClick={toggleSidebar}>
                {button}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-2 py-1 border-t">
          <p className="font-semibold my-2">Filter by status</p>
          {filterStatus.map((button, index) => (
            <div key={index}>
              <button
                className="my-2"
                onClick={() => {
                  setStatusTerm(button);
                  toggleSidebar();
                }}
              >
                {button}
              </button>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

{
  /* <div className="mt-2 py-1 border-t">
          <p className="font-semibold">Filter by genre</p>
          {filterGenres.map((button, index) => (
            <div key={index}>
              <button className="mt-1">{button}</button>
            </div>
          ))}
        </div>
        <div className="mt-2 py-1 border-t">
          <p className="font-semibold">Filter by status</p>
          {filterStatus.map((button, index) => (
            <div key={index}>
              <button className="mt-1">{button}</button>
            </div>
          ))}
        </div> */
}
