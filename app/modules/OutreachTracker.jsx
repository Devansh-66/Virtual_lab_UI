import React from "react";

const OutreachTracker = () => {
  // Dummy outreach data for demo purposes
  const workshops = [
    { id: 1, title: "Virtual Labs Workshop", date: "2025-03-01" },
    { id: 2, title: "Advanced Lab Techniques", date: "2025-04-15" },
    { id: 3, title: "Lab Deployment 101", date: "2025-05-10" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Outreach Tracker</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Workshop Title</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {workshops.map((ws) => (
            <tr key={ws.id}>
              <td className="border p-2">{ws.id}</td>
              <td className="border p-2">{ws.title}</td>
              <td className="border p-2">{ws.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OutreachTracker;
