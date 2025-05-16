export const statusOptions = [
    { value: "Saved", label: "Saved", color: "#64748b" },
    { value: "Applied", label: "Applied", color: "#3b82f6" },
    { value: "Interviewing", label: "Interviewing", color: "#8b5cf6" },
    { value: "Offered", label: "Offered", color: "#10b981" },
    { value: "Rejected", label: "Rejected", color: "#ef4444" },
  ];

  
export const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    if (typeof salary === 'number') return `$${salary.toLocaleString()}`;
    return salary;
  };