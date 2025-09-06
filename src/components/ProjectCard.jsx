export default function ProjectCard({ title, description, status, date }) {
  const statusColors = {
    Open: "bg-green-600",
    "In Progress": "bg-yellow-500",
    Closed: "bg-red-600",
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm mb-3">{description}</p>
      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 text-xs rounded-lg text-white ${
            statusColors[status] || "bg-gray-600"
          }`}
        >
          {status}
        </span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
    </div>
  );
}
