import React, { useState, useEffect } from "react";
import TeamMembers from "./components/TeamMembers";
import ShiftTimetable from "./components/ShiftTimetable";
import Modal from "./components/Modal";

const App: React.FC = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [timetable, setTimetable] = useState<Record<string, string[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddMembersPrompt, setShowAddMembersPrompt] = useState(true);

  useEffect(() => {
    const storedMembers = localStorage.getItem("teamMembers");
    if (storedMembers) {
      setTeamMembers(JSON.parse(storedMembers));
      setShowAddMembersPrompt(false);
    }
  }, []);

  const toggleMember = (member: string) => {
    setSelectedMembers((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  const addMember = (member: string) => {
    setTeamMembers((prevMembers) => [...prevMembers, member]);
    localStorage.setItem(
      "teamMembers",
      JSON.stringify([...teamMembers, member])
    );
    setShowAddMembersPrompt(false);
  };

  const removeMember = (member: string) => {
    setTeamMembers((prevMembers) => prevMembers.filter((m) => m !== member));
    setSelectedMembers((prev) => prev.filter((m) => m !== member));
    const newTimetable = { ...timetable };
    delete newTimetable[member];
    setTimetable(newTimetable);
    localStorage.setItem(
      "teamMembers",
      JSON.stringify([...teamMembers.filter((m) => m !== member)])
    );
  };

  const assignShifts = () => {
    if (selectedMembers.length < 5) {
      alert("You need at least 5 members to assign shifts.");
      setIsModalOpen(false);
      return;
    }

    const newTimetable: Record<string, string[]> = {};

    // Initialize shifts count to ensure two days off for each member
    const shiftsCount: Record<string, number> = {};
    selectedMembers.forEach((member) => {
      shiftsCount[member] = 0;
    });

    // Generate shifts for each day of the week
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    daysOfWeek.forEach((day) => {
      const dayShifts = assignShiftsForDay(selectedMembers, shiftsCount);
      dayShifts.forEach(([member, shift]) => {
        if (!newTimetable[member]) {
          newTimetable[member] = [];
        }
        newTimetable[member].push(shift);
      });
    });

    // Ensure two days off for each member
    Object.keys(newTimetable).forEach((member) => {
      ensureTwoOffDays(newTimetable[member]);
    });

    setTimetable(newTimetable);
    setIsModalOpen(false);
  };

  const assignShiftsForDay = (
    members: string[],
    shiftsCount: Record<string, number>
  ): [string, string][] => {
    const shuffledMembers = shuffleArray([...members]);
    const dayShifts: [string, string][] = [];

    let dayShiftCount = 0;
    let nightShiftCount = 0;

    for (let i = 0; i < shuffledMembers.length; i++) {
      const member = shuffledMembers[i];
      if (dayShiftCount < 3) {
        dayShifts.push([member, "Day"]);
        dayShiftCount++;
        shiftsCount[member]++;
      } else if (nightShiftCount < 2) {
        dayShifts.push([member, "Night"]);
        nightShiftCount++;
        shiftsCount[member]++;
      } else {
        break;
      }
    }

    return dayShifts;
  };

  const ensureTwoOffDays = (shifts: string[]) => {
    let offDaysCount = shifts.filter((shift) => shift === "Off").length;
    while (offDaysCount < 2) {
      const randomIndex = Math.floor(Math.random() * shifts.length);
      if (shifts[randomIndex] !== "Off") {
        shifts[randomIndex] = "Off";
        offDaysCount++;
      }
    }

    while (offDaysCount > 2) {
      const randomIndex = Math.floor(Math.random() * shifts.length);
      if (shifts[randomIndex] === "Off") {
        shifts[randomIndex] = "Day"; // Assign a "Day" shift to balance
        offDaysCount--;
      }
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Shift Scheduler</h1>

      {showAddMembersPrompt ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Add Team Members</h2>
          <TeamMembers
            members={teamMembers}
            selectedMembers={selectedMembers}
            toggleMember={toggleMember}
            addMember={addMember}
            removeMember={removeMember}
          />
          {teamMembers.length > 0 && (
            <button
              onClick={() => setShowAddMembersPrompt(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded shadow mt-4"
            >
              Continue to Assign Shifts
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
            <TeamMembers
              members={teamMembers}
              selectedMembers={selectedMembers}
              toggleMember={toggleMember}
              addMember={addMember}
              removeMember={removeMember}
            />
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Shift Timetable</h2>
            <ShiftTimetable timetable={timetable} daysOfWeek={daysOfWeek} />
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded shadow"
              >
                Assign Shifts
              </button>
            </div>
          </div>
        </div>
      )}

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
