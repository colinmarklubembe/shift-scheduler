import React from "react";

interface TeamMembersProps {
  members: string[];
  selectedMembers: string[];
  toggleMember: (member: string) => void;
}

const TeamMembers: React.FC<TeamMembersProps> = ({
  members,
  selectedMembers,
  toggleMember,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
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
