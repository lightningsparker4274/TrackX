import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import localforage from "localforage";
import CustomTimePicker from "./CustomTimePicker"; // Import the custom time picker


function EditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, index, dataList } = location.state || {}; // Default to empty object if state is undefined
  const [formData, setFormData] = useState(data || {});
  const [timeEntries, setTimeEntries] = useState([]);
  const [totalTime, setTotalTime] = useState("0 min");

  useEffect(() => {
    if (Array.isArray(dataList)) {
      console.log("DataList is an array:", dataList);
    } else {
      console.error("DataList is not an array:", dataList);
    }
  }, [dataList]);

  

 
  useEffect(() => {
    if (data && data.startDate && data.endDate) {
      const workingDays = calculateWorkingDays(data.startDate, data.endDate);
      setTimeEntries(
        new Array(workingDays).fill(null).map(() => ({
          startTime: "",
          endTime: "",
          extraTime: 0,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    calculateTotalTime(timeEntries);
  }, [timeEntries]);


  useEffect(() => {
    calculateTotalTime(timeEntries);
  }, [timeEntries]);

  const handleInputChange = (value, dayIndex, field) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[dayIndex][field] = value;
    setTimeEntries(updatedEntries);
  };

  const calculateTotalTime = (entries) => {
    let totalMinutes = 0;

    entries.forEach(({ startTime, endTime, extraTime }) => {
      if (startTime && endTime) {
        const [startHours, startMinutes, startPeriod] = parseTime(startTime);
        const [endHours, endMinutes, endPeriod] = parseTime(endTime);

        const start24Hour = convertTo24Hour(startHours, startPeriod);
        const end24Hour = convertTo24Hour(endHours, endPeriod);

        const startMinutesFromMidnight = start24Hour * 60 + startMinutes;
        const endMinutesFromMidnight = end24Hour * 60 + endMinutes;

        let diff;
        if (endMinutesFromMidnight >= startMinutesFromMidnight) {
          diff = endMinutesFromMidnight - startMinutesFromMidnight;
        } else {
          diff = 1440 - startMinutesFromMidnight + endMinutesFromMidnight;
        }

        totalMinutes += diff - extraTime;
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    setTotalTime(`${hours} hr ${minutes} min`);
  };

  const convertTo24Hour = (hours, period) => {
    if (period.toLowerCase() === "pm" && hours < 12) {
      return hours + 12;
    } else if (period.toLowerCase() === "am" && hours === 12) {
      return 0;
    }
    return hours;
  };

  const parseTime = (time) => {
    if (!time) return [0, 0, "AM"];
    const [timePart, period] = time.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);
    return [hours, minutes, period];
  };

  const handleSave = () => {
    console.log("Saving data...");

    if (index === undefined || index < 0) {
      console.error("Index is undefined or invalid.");
      return;
    }

    // Paste the new line here
    const updatedDataList = [...(dataList?.length ? dataList : [])];

    if (!Array.isArray(dataList)) {
      console.error("dataList is not an array:", dataList);
      return; // Exit the function if dataList is not an array
    }

    updatedDataList[index] = { ...formData, timeEntries,totalTime };

    localforage
      .setItem("dataList", updatedDataList)
      .then(() => {
        alert("Data Saved!");
        navigate("/store", { state: { dataList: updatedDataList } });
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };



  return (
    <div className="h-full max-w-md p-5 mx-auto text-white bg-white border rounded-md shadow-md lg:mt-10 bg-gradient-to-br from-sky-200 via-violet-100 to-purple-200">
      <p className="mb-4 text-2xl font-semibold text-black underline decoration-double">Edit File Details</p>
      <form className="space-y-4 text-black">
        {/* Form fields */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">File Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded outline-none focus:ring-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate || ""}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full p-2 border rounded outline-none focus:ring-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate || ""}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full p-2 border rounded outline-none focus:ring-2"
          />
        </div>

        <div className="mb-4">
          <h4 className="my-4 text-xl font-semibold text-center decoration-double font-abel">
            Time Entries:
          </h4>
          {timeEntries.map((entry, index) => (
            <div
              key={index}
              className="p-2 mb-4 space-y-4 border-2 border-white rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-2 space-x-2">
                <label className="block text-gray-700">
                  Day {index + 1} Start Time:
                </label>
                <div className="flex">
                  <CustomTimePicker
                    value={entry.startTime}
                    onChange={(value) =>
                      handleInputChange(value, index, "startTime")
                    }
                  />
                </div>
              </div>

              <div className="flex items-center mb-2 space-x-2">
                <label className="block text-gray-700">
                  Day {index + 1} End Time:
                </label>
                <div className="flex-1">
                  <CustomTimePicker
                    value={entry.endTime}
                    onChange={(value) =>
                      handleInputChange(value, index, "endTime")
                    }
                  />
                </div>
              </div>

              <div className="flex items-center mb-2 space-x-2">
                <label className="block text-gray-700">
                  Day {index + 1} Extra Time (Minutes):
                </label>
                <input
                  type="text"
                  value={entry.extraTime}
                  onChange={(e) =>
                    handleInputChange(
                      parseInt(e.target.value, 10) || 0,
                      index,
                      "extraTime"
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold">Total Time:</h4>
          <p className="px-4 py-2 mt-1 text-xl font-semibold text-white bg-black rounded-lg">
            {totalTime}
          </p>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function calculateWorkingDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  let currentDate = start;

  while (currentDate <= end) {
    const day = currentDate.getDay();
    if (day !== 0 && day !== 6) count++;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
}

export default EditPage;
