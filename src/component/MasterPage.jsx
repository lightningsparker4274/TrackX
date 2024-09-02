import { useState, useEffect } from "react";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

localforage.config({
  name: "HiveCRUDDemo",
});

function MasterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isSat: "",
    isNew: true,
    description: "",
    totaltime: "",
  });

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    // Load data from localforage on component mount
    localforage.getItem("dataList").then((data) => {
      if (data) setDataList(data);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "checkbox") {
      // Handle checkbox input
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      // Handle other input types (text, number, etc.)
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDataList = [...dataList, formData];
    setDataList(updatedDataList);

    localforage.setItem("dataList", updatedDataList).then(() => {
      // Show success toast after data is stored
      toast.success("Data Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    });

    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      isSat: "",
      description: "",
      totaltime: "",
    });
  };

  const handleNavigate = () => {
    navigate("/store", { state: { dataList } });
  };

  return (
    <div className="items-center h-screen p-4 lg:mx-[71px] lg:justify-center lg:flex">
      <img
        src="tm.png"
        alt=""
        className="mt-3 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-sm lg:h-[489px] lg:w-[750px]"
      />
      <div className="max-w-md p-3 mx-auto text-white bg-white border rounded-b-lg shadow-md lg:rounded-r-xl lg:mt-3 lg:rounded-tl-sm lg:rounded-bl-sm lg:h-[490px] h-[550px] overflow-auto">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 mx-[60px]">
          TrackX Task Manager😊
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">File Name:</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus: ring-sky-300"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Start Date:</label>
            <input
              required
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus: ring-sky-300"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">End Date:</label>
            <input
              required
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus: ring-sky-300"
            />
          </div>
          <div className="flex items-center justify-between mb-4 w-64">
            <input
              type="checkbox"
              onChange={handleInputChange}
              name="isSat"
              id=""
              value={formData.isSat}
            />
            <label className="block mt-1 mb-2 text-gray-700">
              Are you work on Saturday?
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">File Description</label>
            <textarea
              className="p-1 border border-gray-300 rounded-md focus:ring-2 focus: ring-sky-300"
              rows={4}
              cols={33}
              placeholder="Enter your description here.....😄"
              value={formData.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Add Data
            </button>
            <button
              type="button"
              onClick={handleNavigate}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              View Data
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MasterPage;
