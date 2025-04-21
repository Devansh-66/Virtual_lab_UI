import React, { useState } from "react";

const LabManagement = () => {
  const [labs, setLabs] = useState([
    { id: 1, name: "Physics Lab", status: "Active" },
    { id: 2, name: "Chemistry Lab", status: "Inactive" },
    { id: 3, name: "Biology Lab", status: "Active" },
  ]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Lab Management</h2>
      <ul className="space-y-2">
        {labs.map((lab) => (
          <li key={lab.id} className="border p-2 rounded-md">
            <strong>{lab.name}</strong> - <span>{lab.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LabManagement;
