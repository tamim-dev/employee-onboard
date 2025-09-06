import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

// ------------------- Single Date -------------------
export const SingleCalendar: React.FC<{
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  startMonth: Date;
  endMonth: Date;
}> = ({ selected, onSelect, startMonth, endMonth }) => {
  const today = new Date();
  const minMonth = startMonth || new Date(1900, 0);
  const maxMonth = endMonth || today;
  return (
    <DayPicker
      mode="single"
      startMonth={minMonth}
      endMonth={maxMonth}
      selected={selected}
      onSelect={onSelect}
      captionLayout="dropdown"
      classNames={{
        dropdown:
          "flex gap-2 p-2 bg-gray-800 border border-gray-700 rounded-md",
        caption_label: "hidden",
      }}
    />
  );
};
