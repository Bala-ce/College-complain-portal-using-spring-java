// src/components/DepartmentGrid.jsx
import React from 'react';
import { 
  Monitor, 
  Cpu, 
  Code, 
  Wrench, 
  Building2, 
  Zap, 
  Bus, 
  Coffee, 
  BookOpen, 
  Hammer,
  Activity,
  Database,
  Bot,
  ShieldCheck,
  Briefcase,
  Microchip
} from 'lucide-react';

const icons = {
  'Information Technology (IT)': <Monitor size={24} className="text-emerald-500" />,
  'Electronics & Communication (ECE)': <Cpu size={24} className="text-emerald-500" />,
  'Computer Science (CSE)': <Code size={24} className="text-emerald-500" />,
  'Bio-Medical (BME)': <Activity size={24} className="text-emerald-500" />,
  'Artificial Intelligence & Data Science(AIDS)': <Database size={24} className="text-emerald-500" />,
  'Artificial Intelligence & Machine Learning(AIML)': <Bot size={24} className="text-emerald-500" />,
  'Computer Science & Cyber Security(CSCS)': <ShieldCheck size={24} className="text-emerald-500" />,
  'Computer Science & Business Systems(CSBS)': <Briefcase size={24} className="text-emerald-500" />,
  'Very Large Scale Integration(VLSI)': <Microchip size={24} className="text-emerald-500" />,
  'Mechanical Engineering': <Wrench size={24} className="text-emerald-500" />,
  'Civil Engineering': <Building2 size={24} className="text-emerald-500" />,
  'Electrical & Electronics (EEE)': <Zap size={24} className="text-emerald-500" />,
  'Transport & Bus Fleet': <Bus size={24} className="text-emerald-500" />,
  'Hostel & Dining Services': <Coffee size={24} className="text-emerald-500" />,
  'Library': <BookOpen size={24} className="text-emerald-500" />,
  'Campus Maintenance & Facilities': <Hammer size={24} className="text-emerald-500" />,
};

export default function DepartmentGrid({ departments, onCardClick }) {
  return (
    <div className="w-full max-w-lg mt-6 pb-20">
      <div className="grid grid-cols-2 gap-4">
        {departments.map((dept) => (
          <div
            key={dept}
            onClick={() => onCardClick(dept)}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:shadow-md transition-shadow active:scale-95"
          >
            {icons[dept] || <Monitor size={24} className="text-emerald-500" />}
            <span className="text-sm font-medium text-slate-800">{dept}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
