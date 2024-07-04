import React, { useState } from "react";
import TeamMembers from "./components/TeamMembers";
import ShiftTimetable from "./components/ShiftTimetable";
import Modal from "./components/Modal";

const App: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const shifts = ["Day", "Night"];

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [timetable, setTimetable] = useState<Record<string, string[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMember = (member: string) => {
    setSelectedMembers((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  const addMember = (member: string) => {
    setTeamMembers((prevMembers) => [...prevMembers, member]);
  };

  const removeMember = (member: string) => {
    setTeamMembers((prevMembers) => prevMembers.filter((m) => m !== member));
    setSelectedMembers((prev) => prev.filter((m) => m !== member));
  };

  const assignShifts = () => {
    const newTimetable: Record<string, string[]> = {};

    selectedMembers.forEach((member) => {
      newTimetable[member] = generateShifts();
    });

    setTimetable(newTimetable);
    setIsModalOpen(false);
  };

  const generateShifts = (): string[] => {
    const shiftsForWeek: string[] = [];
    const daysOff = sample(daysOfWeek, 2);

    daysOfWeek.forEach((day) => {
      if (daysOff.includes(day)) {
        shiftsForWeek.push("Off");
      } else {
        const availableShifts = shifts.filter(
          (shift) => shiftsForWeek.filter((s) => s === shift).length < 5
        );
        if (availableShifts.length === 0) {
          shiftsForWeek.push("Off");
        } else {
          shiftsForWeek.push(
            availableShifts[Math.floor(Math.random() * availableShifts.length)]
          );
        }
      }
    });

    return shiftsForWeek;
  };

  const sample = (array: string[], n: number) => {
    const shuffled = array.slice();
    for (let i = array.length; i; i--) {
      const j = Math.floor(Math.random() * i);
      [shuffled[i - 1], shuffled[j]] = [shuffled[j], shuffled[i - 1]];
    }
    return shuffled.slice(0, n);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Shift Scheduler</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
          <TeamMembers
            members={teamMembers}
            selectedMembers={selectedMembers}
            toggleMember={toggleMember}
            addMember={addMember}
          />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Shift Timetable</h2>
          <ShiftTimetable timetable={timetable} daysOfWeek={daysOfWeek} />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded shadow"
        >
          Assign Shifts
        </button>
      </div>
      <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Confirm Shift Assignment</h3>
        <p className="mb-4">
          Are you sure you want to assign shifts to the selected team members?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={assignShifts}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
