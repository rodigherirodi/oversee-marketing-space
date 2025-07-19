
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Line, ComposedChart } from 'recharts';
import { UserProductivity } from '@/types/newEntities';

interface MonthlyEvolutionChartProps {
  user: UserProductivity;
}

const MonthlyEvolutionChart: React.FC<MonthlyEvolutionChartProps> = ({ user }) => {
  const goalScore = 85;
  
  const chartConfig = {
    score: {
      label: "Score",
      color: "#3b82f6",
    },
    goal: {
      label: "Meta",
      color: "#ef4444",
    },
  };

  const chartData = user.monthlyEvolution.map((item, index, array) => ({
    ...item,
    trend: index > 0 ? array[index - 1].score : item.score
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Evolução Mensal (6 meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={[70, 100]}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            
            {/* Linha de Meta */}
            <ReferenceLine 
              y={goalScore} 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              strokeWidth={2}
              label={{ value: `Meta: ${goalScore}%`, position: "insideTopRight" }}
            />
            
            {/* Barras do Score */}
            <Bar 
              dataKey="score" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              fillOpacity={0.8}
            />
            
            {/* Linha de Tendência */}
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#1d4ed8" 
              strokeWidth={3}
              dot={{ fill: '#1d4ed8', strokeWidth: 2, r: 4 }}
              connectNulls
            />
          </ComposedChart>
        </ChartContainer>
        
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Score Mensal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-red-500 border-dashed rounded"></div>
            <span>Meta ({goalScore}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-700"></div>
            <span>Tendência</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyEvolutionChart;
