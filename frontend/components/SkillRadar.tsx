"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'Agentic AI', A: 90, fullMark: 100 },
  { subject: 'LLM Fundamentals', A: 82, fullMark: 100 },
  { subject: 'RAG', A: 68, fullMark: 100 },
  { subject: 'Vector Databases', A: 45, fullMark: 100 },
  { subject: 'Prompt Engineering', A: 85, fullMark: 100 },
];

export default function SkillRadar() {
  return (
    <div className="w-full h-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Competency"
            dataKey="A"
            stroke="#1D4ED8"
            strokeWidth={2}
            fill="#1D4ED8"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
