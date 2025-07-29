
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Mock data para demonstração
const mockData = [
  { month: 'Jan', score: 75 },
  { month: 'Fev', score: 78 },
  { month: 'Mar', score: 82 },
  { month: 'Abr', score: 80 },
  { month: 'Mai', score: 85 },
  { month: 'Jun', score: 88 },
];

const MonthlyEvolutionChart = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            fontSize={12}
            className="text-muted-foreground"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            fontSize={12}
            className="text-muted-foreground"
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyEvolutionChart;
