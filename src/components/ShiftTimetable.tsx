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
        valign: "middle",
        fontSize: 10,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: {
        top: 30,
      },
    });

    doc.save("shift-timetable.pdf");
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="py-2 px-4 text-left border-b-2 border-gray-200">
              Members
            </th>
            {daysOfWeek.map((day) => (
              <th
                key={day}
                className="py-2 px-4 text-left border-b-2 border-gray-200"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(timetable).map(([member, shifts], idx) => (
            <tr
              key={member}
              className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="py-2 px-4 border-b border-gray-200">{member}</td>
              {shifts.map((shift, index) => (
                <td key={index} className="py-2 px-4 border-b border-gray-200">
                  {shift}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-6">
        <button
          onClick={downloadPDF}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ShiftTimetable;
