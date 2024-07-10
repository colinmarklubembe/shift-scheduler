import React, { useState, useEffect } from "react";
import TeamMembers from "./TeamMembers";
import ShiftTimetable from "./ShiftTimetable";
import Modal from "./Modal";

const Assign: React.FC = () => {
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

  // State variables for shift requirements
  const [weekdayDayShifts, setWeekdayDayShifts] = useState(3);
  const [weekdayNightShifts, setWeekdayNightShifts] = useState(2);
  const [weekendDayShifts, setWeekendDayShifts] = useState(1);
  const [weekendNightShifts, setWeekendNightShifts] = useState(1);
  const [workWeekends, setWorkWeekends] = useState(true);

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

  const calculateRequiredPeople = (): number => {
    let totalWeekdayShifts = 0;
    let totalWeekendShifts = 0;

    // Calculate total weekday shifts
    totalWeekdayShifts =
      (weekdayDayShifts + weekdayNightShifts) * daysOfWeek.slice(0, 5).length;

    // Calculate total weekend shifts if workWeekends is true
    if (workWeekends) {
      totalWeekendShifts =
        (weekendDayShifts + weekendNightShifts) * daysOfWeek.slice(5).length;
    }

    // Total weekly shifts
    const totalWeeklyShifts = totalWeekdayShifts + totalWeekendShifts;

    // Calculate the number of required team members
    const totalRequiredPeople = Math.ceil(totalWeeklyShifts / 5);
    return totalRequiredPeople;
  };
  console.log(calculateRequiredPeople());

  const assignShifts = () => {
    const totalRequiredPeople = calculateRequiredPeople();

    if (selectedMembers.length < totalRequiredPeople) {
      alert(
        `You need at least ${totalRequiredPeople} members to assign shifts.`
      );
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
      let requiredDayShifts = weekdayDayShifts;
      let requiredNightShifts = weekdayNightShifts;

      if ((day === "Saturday" || day === "Sunday") && workWeekends) {
        requiredDayShifts = weekendDayShifts;
        requiredNightShifts = weekendNightShifts;
      }

      for (let i = 0; i < dayMembers.length; i++) {
        const member = dayMembers[i];
        if (shiftsCount[member] < 5) {
          if (dayShiftCount < requiredDayShifts) {
            newTimetable[member].push(`Day`);
            shiftsCount[member]++;
            dayShiftCount++;
          } else if (nightShiftCount < requiredNightShifts) {
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
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-600">
        Shift Scheduler
      </h1>

      {showAddMembersPrompt ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-500">
            Add Team Members
          </h2>
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded shadow mt-4"
            >
              Continue to Assign Shifts
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="weekdayDayShifts"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Weekday Day Shifts
                </label>
                <input
                  id="weekdayDayShifts"
                  type="number"
                  value={weekdayDayShifts}
                  onChange={(e) => setWeekdayDayShifts(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="weekdayNightShifts"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Weekday Night Shifts
                </label>
                <input
                  id="weekdayNightShifts"
                  type="number"
                  value={weekdayNightShifts}
                  onChange={(e) =>
                    setWeekdayNightShifts(Number(e.target.value))
                  }
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="weekendDayShifts"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Weekend Day Shifts
                </label>
                <input
                  id="weekendDayShifts"
                  type="number"
                  value={weekendDayShifts}
                  onChange={(e) => setWeekendDayShifts(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded w-full"
                  disabled={!workWeekends}
                />
              </div>
              <div>
                <label
                  htmlFor="weekendNightShifts"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Weekend Night Shifts
                </label>
                <input
                  id="weekendNightShifts"
                  type="number"
                  value={weekendNightShifts}
                  onChange={(e) =>
                    setWeekendNightShifts(Number(e.target.value))
                  }
                  className="p-2 border border-gray-300 rounded w-full"
                  disabled={!workWeekends}
                />
              </div>
              <div className="col-span-2 flex items-center">
                <input
                  id="workWeekends"
                  type="checkbox"
                  checked={workWeekends}
                  onChange={(e) => setWorkWeekends(e.target.checked)}
                  className="mr-2"
                />
                <label
                  htmlFor="workWeekends"
                  className="font-medium text-gray-700"
                >
                  Work on Weekends
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-indigo-500">
                <strong>Team Members</strong>
                <span className="font-semibold">
                  <br />
                  (Required: {calculateRequiredPeople()})
                </span>
              </h2>
              <TeamMembers
                members={teamMembers}
                selectedMembers={selectedMembers}
                toggleMember={toggleMember}
                addMember={addMember}
                removeMember={removeMember}
              />
            </div>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-500">
                Shift Timetable
              </h2>
              <ShiftTimetable timetable={timetable} daysOfWeek={daysOfWeek} />
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded shadow"
                >
                  Assign Shifts
                </button>
              </div>
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Assign;
