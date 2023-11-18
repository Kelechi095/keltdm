import Header from "../components/Header";
import useGetRecommendation from "../hooks/recommendation/useGetRecommendation";

import { customFetch } from "../utils/customFetch";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import Search from "../components/Search";
import SortGenre from "../components/SortGenre";
import Recommendations from "../components/Recommendations";
import Nav from "../components/Nav";

export default function Recommendation() {
  
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);
  
  const [sortTerm, setSortTerm] = useState("Newest");
  const [genreTerm, setGenreTerm] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();
  
  const debouncedValue = useDebounce(searchTerm, 500);
  
  const searchQuery = `sort=${sortTerm}&genre=${genreTerm}&search=${debouncedValue}&limit=10&page=${currentPage}`;
  
  const queryClient = useQueryClient();

  console.log(searchQuery)

  const fetchUser = async () => {
    const response = await customFetch.get("/auth/user");
    return response.data;
  };

  const fetchRecs = async() => {
    const response = await customFetch.get(`/recommend?${searchQuery}`)
    return response.data
}

  const { data, isLoading } = useQuery(["singleRecommendation", searchQuery], () =>
    fetchRecs(searchQuery)
  );


  const likeBook = async (id) => {
    await customFetch.patch(`/recommend/likes/${id}`);
  };

  const { data: user } = useQuery("user", fetchUser);

  const { mutate: likeMutate } = useMutation((id) => likeBook(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("singleRecommendation");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error, {
        position: toast.POSITION.TOP_CENTER,
        className: "text-xs ",
      });
    },
  });

  const addBookLib = async (book) => {
    const response = await customFetch.post(`/recommend/add`, {
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre,
      thumbnail: book.thumbnail,
      smallThumbnail: book.smallThumbnail,
    });

    return response.data;
  };

  const { isLoading: isAdding, mutate: addBookLibMutation } = useMutation(
    "books",
    (book) => addBookLib(book),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("books");
        toast.success("Book added to library", {
          position: toast.POSITION.TOP_CENTER,
          className: "text-xs w-fit h-fit mx-auto",
        }),
          navigate("/");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.msg || error?.response?.data?.error,
          {
            position: toast.POSITION.TOP_CENTER,
            className: "text-xs",
          }
        );
      },
    }
  );

  const toggleFilterBar = () => {
    setIsFilter(!isFilter);
  };
  const toggleSortBar = () => {
    setIsSort(!isSort);
  };

  const handlePageNext = () => {
    if (currentPage < data?.numOfPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePagePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [genreTerm, searchTerm]);

  const handleLike = (id) => {
    likeMutate(id);
  };

  const handleAddToLibrary = (book) => {
    addBookLibMutation(book);
  };



  return (
    <div className="mx-auto text-slate-900 grid lg:grid-cols-10 gap-2 relative">
      <div className="hidden lg:grid justify-center px-4 lg:fixed lg:w-[20%] lg:left-0  bg-white border-r h-screen">
        <Nav />
      </div>
      <div className=" px-4 lg:absolute lg:right-0 lg:w-[80%]">
      <Header title={"Book Recommendations"} />

      <div className="bg-white py-4 px-2 lg:px-16 mx-auto shadow-sm">
        <h2 className="hidden lg:block text-center text-2xl py-2 px-4 font-semibold uppercase text-slate-600">Recommendations</h2>
      <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

      <SortGenre
        isSort={isSort}
        isFilter={isFilter}
        sortTerm={sortTerm}
        setSortTerm={setSortTerm}
        setGenreTerm={setGenreTerm}
        genreTerm={genreTerm}
        toggleFilterBar={toggleFilterBar}
        toggleSortBar={toggleSortBar}
      />
      </div>

      {isLoading && debouncedValue ? (
        <Loader />
      ) : debouncedValue && data.recommendations?.length < 1 ? (
        <div className="h-60 flex items-center justify-center">
          <h2 className="text-slate-800 text-2xl">Search result not found</h2>
        </div>
      ) : !debouncedValue && data?.recommendations?.length < 1 ? (
        <div className="h-60 flex items-center justify-center">
          <h2 className="text-slate-800 text-2xl">No recommendations</h2>
        </div>
      ) : isLoading ? (
        <Loader />
      ) : (
        <Recommendations 
          data={data}
          handleLike={handleLike}
          handleAddToLibrary={handleAddToLibrary}
          user={user}
        />
      )}

      {isLoading ||
      data?.recommendations?.length < 1 ||
      (debouncedValue && data?.books?.length < 1) ? null : (
        <Pagination
          data={data}
          currentPage={currentPage}
          handlePageNext={handlePageNext}
          handlePagePrev={handlePagePrev}
        />
      )}
      </div>
    </div>
  );
}

