import React, { useState } from "react";

interface TeamMembersProps {
  members: string[];
  selectedMembers: string[];
  toggleMember: (member: string) => void;
  addMember: (member: string) => void;
}

const TeamMembers: React.FC<TeamMembersProps> = ({
  members,
  selectedMembers,
  toggleMember,
  addMember,
}) => {
  const [newMember, setNewMember] = useState("");

  const handleAddMember = () => {
    if (newMember.trim() !== "") {
      addMember(newMember.trim());
      setNewMember(""); // Clear input field after adding member
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Input field to add new member */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
        <input
          type="text"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="Enter new member"
          className="form-input h-10 px-4 w-full border rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddMember}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Existing members */}
      {members.map((member) => (
        <div
          key={member}
          className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedMembers.includes(member)}
              onChange={() => toggleMember(member)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-lg">{member}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
