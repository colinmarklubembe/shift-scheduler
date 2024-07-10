import React, { useState, useEffect } from "react";
import TeamMembers from "./components/TeamMembers";
import ShiftTimetable from "./components/ShiftTimetable";
import Modal from "./components/Modal";

const App: React.FC = () => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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
      JSON.stringify(teamMembers.filter((m) => m !== member))
    );
  };

  const assignShifts = () => {
    const requiredShifts: any = {
      Monday: { day: 3, night: 2 },
      Tuesday: { day: 3, night: 2 },
      Wednesday: { day: 3, night: 2 },
      Thursday: { day: 3, night: 2 },
      Friday: { day: 3, night: 2 },
      Saturday: { day: 1, night: 1 },
      Sunday: { day: 1, night: 1 },
    };

    if (selectedMembers.length < 7) {
      alert("You need at least 7 members to assign shifts.");
      setIsModalOpen(false);
      return;
    }

    const newTimetable: Record<string, string[]> = {};

    // Initialize shifts count to ensure two days off for each member
    const shiftsCount: Record<string, number> = {};
    selectedMembers.forEach((member) => {
      shiftsCount[member] = 0;
      newTimetable[member] = [];
    });

    // Helper function to shuffle an array
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = array.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Assign shifts for each day
    daysOfWeek.forEach((day) => {
      const dayMembers = shuffleArray([...selectedMembers]);

      let dayShiftCount = 0;
      let nightShiftCount = 0;

      for (let i = 0; i < dayMembers.length; i++) {
        const member = dayMembers[i];
        if (shiftsCount[member] < 5) {
          if (dayShiftCount < requiredShifts[day].day) {
            newTimetable[member].push(`Day`);
            shiftsCount[member]++;
            dayShiftCount++;
          } else if (nightShiftCount < requiredShifts[day].night) {
            newTimetable[member].push(`Night`);
            shiftsCount[member]++;
            nightShiftCount++;
          } else {
            newTimetable[member].push(`Off`);
          }
        } else {
          newTimetable[member].push(`Off`);
        }
      }
    });

    // Ensure each member has exactly two off days
    Object.keys(newTimetable).forEach((member) => {
      let offDaysCount = newTimetable[member].filter((shift) =>
        shift.endsWith("Off")
      ).length;
      while (offDaysCount < 2) {
        const randomDay = Math.floor(Math.random() * daysOfWeek.length);
        const shift = newTimetable[member][randomDay];
        if (!shift.endsWith("Off")) {
          newTimetable[member][randomDay] = shift.replace(
            / (Day|Night)$/,
            " Off"
          );
          offDaysCount++;
        }
      }
    });

    setTimetable(newTimetable);
    setIsModalOpen(false);
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
