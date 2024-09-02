import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";
//import { Delete, Edit } from "@mui/icons-material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import File from "./icons/File";
import Delete from "./icons/Delete";
import Edit from "./icons/Edit";
function StorePage() {
  const navigate = useNavigate();
  const [dataList, setDataList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    localforage
      .getItem("dataList")
      .then((data) => {
        if (Array.isArray(data)) {
          setDataList(data);
         //console.log(data);
        } else {
          console.error("Retrieved dataList is not an array:", data);
          setDataList([]);
        }
      })
      .catch((error) => {
        console.error("Error retrieving dataList from localForage:", error);
        setDataList([]);
      });
  }, []);

  const handleDelete = (index) => {
    var isok = prompt("type ok delete...");
    if (isok) {
      const updatedDataList = dataList.filter((_, i) => i !== index);
      setDataList(updatedDataList);
      localforage.setItem("dataList", updatedDataList);
      toast.success("Data Deleted Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleEdit = (index) => {
    if (index >= 0 && index < dataList.length) {
      navigate("/files", { state: { data: dataList[index], index, dataList } });
    } else {
      console.error("Invalid index provided for navigation.");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Handle search input
  };

  const filteredDataList = dataList.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ); // Filter data based on search query

  return (
    <div className="h-screen p-5 bg-gradient-to-br from-sky-200 via-violet-100 to-purple-200">
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold underline decoration-double ">
          # Data Page
        </h3>
        <a
          href="/protected"
          className="px-4 py-1 text-blue-400 border-2 border-blue-400 rounded hover:bg-blue-400 hover:text-white"
        >
          <span className="text-xl font-bold ">Home</span>
        </a>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by file name...😉"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mt-3 mb-5 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />

      <div className="grid gap-5 text-black rounded-md sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredDataList.map((item, index) => {
          const totalDays =
            item.startDate &&
            item.endDate &&
            isValidDate(item.startDate) &&
            isValidDate(item.endDate)
              ? calculateWorkingDays(item.startDate, item.endDate, item.isSat)
              : "N/A";

          return (
            <div
              key={index}
              className="p-2 mb-4 bg-white border-2 rounded-lg shadow-lg hover:odd:border-green-300 hover:even:border-purple-300 hover: sm:flex-row"
            >
              <div className="flex p-2 border rounded-lg odd:border-green-400 even:border-purple-300 item-center w-full">
                {/* <strong className="mr-1 text-lg">File Name:</strong> */}
                <File />
                <span className="text-xl font-bold indent-4 text-ellipsis overflow-hidden">
                  {item.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between mx-auto mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <strong>Start Date:</strong> {item.startDate || "N/A"}
                  <strong>End Date:</strong> {item.endDate || "0"}
                  <strong>Total Time:</strong> {item.totalTime || 0}
                  <strong>Sat work:</strong> {item.isSat ? "Yes" : "No"}
                  <strong>Total Days:</strong> <span>{totalDays}</span>
                </div>
                <div className="flex-col mx-5 mt-4 sm:mt-0 sm:flex-row sm:mx-auto">
                  <div className="flex items-start justify-center space-x-5 item">
                    <button
                      className="p-2 border border-black rounded-full hover:bg-green-300"
                      onClick={() => handleEdit(index)}
                    >
                      <Edit />
                    </button>
                    <button
                      className="p-2 border border-black rounded-full hover:bg-red-300"
                      onClick={() => handleDelete(index)}
                    >
                      <Delete />
                    </button>
                  </div>
                  <div className="flex items-center justify-center mt-4 border-4 border-yellow-300 rounded-full h-[100px] w-[100px] sm:mt-0">
                    <p className="text-5xl">{totalDays}</p><span className="font-semibold">days</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
}

export default StorePage;

function calculateWorkingDays(startDate, endDate, isSat) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  let currentDate = start;

  while (currentDate <= end) {
    const day = currentDate.getDay();
    //if (day !== 0 && day !== 6 && !isSat) count++;
    if (day !== 0 && day !== 6) {
      // Case where the day is neither Sunday (0) nor Saturday (6)
      count++;
    } else if (day === 6 && isSat) {
      // Case where the day is Saturday (6) and isSat is true
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
