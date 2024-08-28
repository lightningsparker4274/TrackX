import { useState } from "react";

// eslint-disable-next-line react/prop-types
const CustomTimePicker = ({ value, onChange }) => {
  // eslint-disable-next-line react/prop-types
  const [hours, setHours] = useState(value ? value.split(":")[0] : "00");
  // eslint-disable-next-line react/prop-types
  const [minutes, setMinutes] = useState(value ? value.split(":")[1] : "00");
  const [period, setPeriod] = useState(
    // eslint-disable-next-line react/prop-types
    value && value.includes("PM") ? "PM" : "AM"
  );

  const handleTimeChange = () => {
    onChange(`${hours}:${minutes} ${period}`);
  };

  return (
    <div className="time-picker">
      <select
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        onBlur={handleTimeChange}
      >
        {[...Array(12).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
      :
      <select
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        onBlur={handleTimeChange}
      >
        {[...Array(60).keys()].map((num) => (
          <option key={num} value={num < 10 ? `0${num}` : num}>
            {num < 10 ? `0${num}` : num}
          </option>
        ))}
      </select>
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        onBlur={handleTimeChange}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default CustomTimePicker;
