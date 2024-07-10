import React, { useState } from "react";

interface TeamMembersProps {
  members: string[];
  selectedMembers: string[];
  toggleMember: (member: string) => void;
  addMember: (member: string) => void;
  removeMember: (member: string) => void;
}

const TeamMembers: React.FC<TeamMembersProps> = ({
  members,
  selectedMembers,
  toggleMember,
  addMember,
  removeMember,
}) => {
  const [newMember, setNewMember] = useState("");

  const handleAddMember = () => {
    if (newMember.trim() !== "") {
      addMember(newMember.trim());
      setNewMember(""); // Clear input field after adding member
    }
  };

  return (
    <div className="space-y-4">
      {/* Input field to add new member */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
        <input
          type="text"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="Enter new member"
          className="form-input h-10 px-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleAddMember}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
        >
          Add
        </button>
      </div>

      {/* Existing members */}
      {members.map((member) => (
        <div
          key={member}
          className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedMembers.includes(member)}
              onChange={() => toggleMember(member)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="text-lg text-gray-700">{member}</span>
          </label>
          <button
            onClick={() => removeMember(member)}
            className="text-red-500 hover:text-red-700 focus:outline-none"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
