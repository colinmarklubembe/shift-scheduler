import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ShiftTimetableProps {
  timetable: Record<string, string[]>;
  daysOfWeek: string[];
}

const ShiftTimetable: React.FC<ShiftTimetableProps> = ({
  timetable,
  daysOfWeek,
}) => {
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Shift Timetable", 105, 10, { align: "center" });

    const tableColumnHeaders = ["Member", ...daysOfWeek];
    const tableRows: Array<string[]> = [];

    Object.entries(timetable).forEach(([member, shifts]) => {
      const shiftRow = [member, ...shifts];
      tableRows.push(shiftRow);
    });

    // @ts-ignore
    doc.autoTable({
      startY: 20,
      head: [tableColumnHeaders],
      body: tableRows,
      styles: {
        halign: "center",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    doc.save("shift-timetable.pdf");
  };

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
      <div className="flex justify-center mt-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ShiftTimetable;
