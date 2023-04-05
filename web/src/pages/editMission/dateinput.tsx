import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./editMission.scss"
import "../Setting/setting.scss"

interface DateRangeInputProps {
  label: string;
  size: "medium";
}

const DateRangeInput = ({ label, size }: DateRangeInputProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const handleInputClick = () => {
    setShowCalendar(true);
  };

  return (
    <div style={{ position: "relative" }}>
      <label>{label}</label>
      <div style={{ display: "flex", alignItems: "center" }}>
      <input
        type="text"
        value={startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : ""}
        onClick={handleInputClick}
        onBlur={handleCloseCalendar} // Ajout de la prop onBlur
        readOnly
        style={{
          paddingRight: "36px",
          width: "100%",
          height:"40px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          onClick={handleInputClick}
          style={{
            position: "absolute",
            right: "10px",
            cursor: "pointer",
            fill: "#333",
          }}
        >
          <path d="M20,22H4V10H20M20,8H4V6H20V8Z" />
        </svg>
        {showCalendar && (
          <div style={{ position: "absolute", zIndex: 1 }}>
            <DatePicker
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              onChange={handleStartDateChange}
              selectsStart
              inline
              showMonthDropdown
              showYearDropdown
              onCalendarClose={handleCloseCalendar}

            />
            <DatePicker
              selected={endDate}
              startDate={startDate}
              endDate={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              inline
              showMonthDropdown
              showYearDropdown
              onCalendarClose={handleCloseCalendar}

            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangeInput;
