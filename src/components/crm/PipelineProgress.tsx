
import React from 'react';
import { Pipeline } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';

interface PipelineProgressProps {
  pipeline: Pipeline;
  currentStage: string;
  onStageChange: (stageId: string) => void;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({
  pipeline,
  currentStage,
  onStageChange
}) => {
  const sortedStages = pipeline.stages
    .filter(stage => stage.stageType !== 'lost')
    .sort((a, b) => a.order - b.order);

  const currentStageIndex = sortedStages.findIndex(stage => stage.id === currentStage);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {sortedStages.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isPassed = index < currentStageIndex;
          const canClick = index <= currentStageIndex + 1;

          return (
            <div key={stage.id} className="flex flex-col items-center flex-1">
              <Button
                variant={isActive ? 'default' : isPassed ? 'secondary' : 'outline'}
                size="sm"
                className={`w-8 h-8 rounded-full p-0 ${canClick ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => canClick && onStageChange(stage.id)}
                disabled={!canClick}
              >
                {isPassed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </Button>
              <span className={`text-xs mt-1 text-center ${isActive ? 'font-semibold text-primary' : 'text-gray-500'}`}>
                {stage.name}
              </span>
              <span className="text-xs text-gray-400">
                {stage.probability}%
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ 
              width: `${(currentStageIndex / (sortedStages.length - 1)) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};
