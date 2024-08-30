import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import localforage from "localforage";

function EditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, index, dataList } = location.state || {}; // Default to empty object if state is undefined
  const [formData, setFormData] = useState(data || {});
  const [timeEntries, setTimeEntries] = useState([]);
  const [totalTime, setTotalTime] = useState("0 min");
  const [dates, setDates] = useState([]);
  const [savedTimes, setSavedTimes] = useState([]);

  /* useEffect(() => {
    if (Array.isArray(dataList)) {
      console.log("DataList is an array:", dataList);
    } else {
      console.error("DataList is not an array:", dataList);
    }
  }, [dataList]); */

  useEffect(() => {
    if (!data) return;

    const getData =
      JSON.parse(localStorage.getItem(`timeEntries_${index}`)) || [];

    if (getData.length > 0) {
      //console.log("getData: ", getData);
      setSavedTimes(getData);
      setTimeEntries(getData);
    } else {
      setSavedTimes(
        dates.map((date) => ({ date: date.date, startTime: "", endTime: "" }))
      );
    }
  }, [data, index, dates]);

  useEffect(() => {
    if (data && data.startDate && data.endDate) {
      const workingDays = calculateWorkingDays(
        data.startDate,
        data.endDate,
        data.isSat
      );
      setTimeEntries(
        new Array(workingDays).fill(null).map(() => ({
          startTime: "",
          endTime: "",
          extraTime: 0,
        }))
      );

      const generatedDates = [];
      let currentDate = new Date(data.startDate);
      const savedTimesInit = [];

      while (currentDate <= new Date(data.endDate)) {
        const dayName = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dateStr = currentDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        generatedDates.push({ date: dateStr, day: dayName });

        // Initialize saved times for each date
        savedTimesInit.push({ date: dateStr, startTime: "", endTime: "" });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      setDates(generatedDates);
      setSavedTimes(savedTimesInit);
    }
  }, [data]);

  useEffect(() => {
    calculateTotalTime(timeEntries);
  }, [timeEntries]);

  const handleInputChange = (value, dayIndex, field) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[dayIndex][field] = value;
    setTimeEntries(updatedEntries);

    // Update savedTimes
    const updatedSavedTimes = [...savedTimes];
    updatedSavedTimes[dayIndex] = {
      ...updatedSavedTimes[dayIndex],
      [field]: value,
    };
    setSavedTimes(updatedSavedTimes);

    // Recalculate total time after change
    calculateTotalTime(updatedEntries);
  };

  const calculateTotalTime = (entries) => {
    let totalMinutes = 0;

    entries.forEach(({ startTime, endTime, extraTime }) => {
      if (startTime && endTime) {
        //console.log(`Start Time: ${startTime}, End Time: ${endTime}`);

        // Parse times
        const [startHours, startMinutes, startPeriod] = parseTime(startTime);
        const [endHours, endMinutes, endPeriod] = parseTime(endTime);

        //console.log(`Parsed Start Time: ${startHours}:${startMinutes} ${startPeriod}`);
        //console.log(`Parsed End Time: ${endHours}:${endMinutes} ${endPeriod}`);

        // Convert to 24-hour format
        const start24Hour = convertTo24Hour(startHours, startPeriod);
        const end24Hour = convertTo24Hour(endHours, endPeriod);

        //console.log(`Start in 24-Hour: ${start24Hour}, End in 24-Hour: ${end24Hour}` );

        const startMinutesFromMidnight = start24Hour * 60 + startMinutes;
        const endMinutesFromMidnight = end24Hour * 60 + endMinutes;

        //console.log(`Minutes from Midnight (Start): ${startMinutesFromMidnight}, (End): ${endMinutesFromMidnight}` );

        let diff;
        if (endMinutesFromMidnight >= startMinutesFromMidnight) {
          diff = endMinutesFromMidnight - startMinutesFromMidnight;
        } else {
          diff = 1440 - startMinutesFromMidnight + endMinutesFromMidnight;
        }

        //console.log(`Difference in Minutes: ${diff}`);

        // Adjust total minutes
        totalMinutes += diff - (parseInt(extraTime, 10) || 0);
        //console.log(`Total Minutes After Adjustment: ${totalMinutes}`);
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    //console.log(`Total Time: ${hours} hr ${minutes} min`);
    setTotalTime(`${hours} hr ${minutes} min`);
  };

  const convertTo24Hour = (hours, period) => {
    if (period === "PM" && hours !== 12) {
      return hours + 12; // Convert PM hours, except 12 PM, to 24-hour format
    }
    if (period === "AM" && hours === 12) {
      return 0; // Convert 12 AM to 0 hours (midnight)
    }
    return hours; // Otherwise, return hours as is (AM times are correct already)
  };

  const parseTime = (timeString) => {
    // Example timeString: "02:30 PM"
    const [time, period] = timeString.split(" "); // Split by space to separate the period (AM/PM)
    const [hours, minutes] = time.split(":").map(Number); // Split time by ':' and convert to numbers
    return [hours, minutes, period];
  };

  const handleSave = () => {
    //console.log("Saving data...");

    if (index === undefined || index < 0) {
      console.error("Index is undefined or invalid.");
      return;
    }

    const formattedTimeEntries = timeEntries.map((entry, idx) => ({
      ...entry,
      startTime: savedTimes[idx]?.startTime || entry.startTime,
      endTime: savedTimes[idx]?.endTime || entry.endTime,
    }));

    localStorage.setItem(
      `timeEntries_${index}`,
      JSON.stringify(formattedTimeEntries)
    );

    const updatedDataList = [...(dataList?.length ? dataList : [])];
    if (Array.isArray(dataList)) {
      updatedDataList[index] = {
        ...formData,
        timeEntries: formattedTimeEntries,
        totalTime,
      };
      localforage
        .setItem("dataList", updatedDataList)
        .then(() => {
          alert("Data Saved!");
          navigate("/store", { state: { dataList: updatedDataList } });
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    } else {
      console.error("dataList is not an array:", dataList);
    }
  };

  const handleback = () => {
    navigate("/store");
  };

  return (
    <div className="h-full max-w-md p-5 mx-auto text-white bg-white border rounded-md shadow-md lg:mt-10 bg-gradient-to-br from-sky-200 via-violet-100 to-purple-200">
      <p className="mb-4 text-2xl font-semibold text-black underline decoration-double">
        Edit File Details
      </p>
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
          <label className="block mb-2 text-gray-700">
            Include Saturday:
            <input
              type="checkbox"
              name="isSat"
              checked={formData.isSat || false}
              onChange={(e) =>
                setFormData({ ...formData, isSat: e.target.checked })
              }
              className="ml-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Description</label>
          <textarea
            rows={4}
            cols={51}
            name="description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded outline-none focus:ring-2"
          />
        </div>
        <p className="text-2xl font-semibold text-center underline decoration-double">
          Time Entries
        </p>
        <div>
          {dates.map((day, index) => (
            <div
              key={index}
              className="p-3 mb-4 bg-white border rounded-md shadow-md"
            >
              <div className="flex flex-col">
                <p className="font-bold">{day.date}</p>
                <p>{day.day}</p>
              </div>
              <div>
                <label className="block mt-2 text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={timeEntries[index]?.startTime}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "startTime")
                  }
                  className="w-full p-2 mt-1 border rounded outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block mt-2 text-gray-700">End Time</label>
                <input
                  type="time"
                  value={timeEntries[index]?.endTime}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "endTime")
                  }
                  className="w-full p-2 mt-1 border rounded outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block mt-2 text-gray-700">Extra Time</label>
                <input
                  type="number"
                  value={timeEntries[index]?.extraTime}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, "extraTime")
                  }
                  className="w-full p-2 mt-1 border rounded outline-none focus:ring-2"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4 card example-2">
          <div className="inner">
            <h4 className="text-2xl text-black">Total Time:</h4>
            <p className="px-5 py-2 text-2xl font-semibold text-white bg-black rounded-md">
              {totalTime}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-5 text-2xl font-semibold text-center text-black underline decoration-double">
            #Saved Times:
          </h4>
          <div className="p-2 space-y-2 bg-white rounded-lg">
            {savedTimes.map((entry, index) => {
              const isSunday = dates[index]?.day === "Sunday";
              const isSaturday = dates[index]?.day === "Saturday";

              // Skip Sundays entirely
              if (isSunday) {
                return null;
              }

              // Show Saturday details only if isSat is true
              if (isSaturday && data.isSat == false) {
                return null;
              }

              return (
                <div key={index} className="flex p-2 mb-2 text-black">
                  <div>
                    <p className="text-lg font-semibold">Date:</p>
                    <p className="text-lg font-semibold">Start Time:</p>
                    <p className="text-lg font-semibold">End Time:</p>
                    <br />
                    <hr className="font-bold" />
                  </div>

                  <div className="">
                    <p className="text-lg indent-5">
                      {dates[index]?.date} ({dates[index]?.day})
                    </p>
                    <p className="text-lg indent-5">
                      {" "}
                      {savedTimes[index]?.startTime || "Not Set"}
                    </p>
                    <p className="text-lg indent-5">
                      {savedTimes[index]?.endTime || "Not Set"}
                    </p>
                    <br />
                    <hr />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between pt-2 space-x-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-8 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleback}
            className="px-8 py-2 font-semibold text-white bg-black rounded-md hover:bg-gray-200"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

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

export default EditPage;
