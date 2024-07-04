// src/components/ShiftTimetable.tsx
import React from "react";

interface ShiftTimetableProps {
  timetable: Record<string, string[]>;
  daysOfWeek: string[];
}

const ShiftTimetable: React.FC<ShiftTimetableProps> = ({
  timetable,
  daysOfWeek,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Members</th>
            {daysOfWeek.map((day) => (
              <th key={day} className="py-2 px-4 text-left">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(timetable).map(([member, shifts]) => (
            <tr key={member} className="border-b">
              <td className="py-2 px-4">{member}</td>
              {shifts.map((shift, index) => (
                <td key={index} className="py-2 px-4">
                  {shift}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftTimetable;
