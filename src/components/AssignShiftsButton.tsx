// src/components/AssignShiftsButton.tsx
import React from "react";

interface AssignShiftsButtonProps {
  assignShifts: () => void;
}

const AssignShiftsButton: React.FC<AssignShiftsButtonProps> = ({
  assignShifts,
}) => {
  return (
    <button
      onClick={assignShifts}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
    >
      Assign Shifts
    </button>
  );
};

export default AssignShiftsButton;
