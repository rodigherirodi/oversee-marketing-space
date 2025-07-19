
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Play, 
  CheckCircle2, 
  FileText, 
  Video,
  Star
} from 'lucide-react';
import { CoursoTrilha } from '../../types/trilhas';
import { useTrilhas } from '../../contexts/TrilhasContext';

interface CourseChecklistProps {
  trilhaId: string;
  courses: CoursoTrilha[];
}

const CourseChecklist: React.FC<CourseChecklistProps> = ({ trilhaId, courses }) => {
  const { toggleCourseCompletion, getTrilhaProgress } = useTrilhas();
  const progress = getTrilhaProgress(trilhaId);

  const handleToggleComplete = (courseId: string) => {
    toggleCourseCompletion(trilhaId, courseId);
  };

  const isCourseCompleted = (courseId: string) => {
    return progress?.completedCourses.includes(courseId) || false;
  };

  const sortedCourses = [...courses].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cursos da Trilha ({progress?.completedCourses.length || 0}/{courses.length})
      </h3>
      
      {sortedCourses.map((course) => {
        const isCompleted = isCourseCompleted(course.id);
        
        return (
          <Card 
            key={course.id} 
            className={`transition-all duration-200 ${
              isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center pt-1">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => handleToggleComplete(course.id)}
                    className="w-5 h-5"
                  />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium ${isCompleted ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                        {course.title}
                        {course.mandatory && (
                          <Star className="inline w-4 h-4 ml-1 text-orange-500 fill-orange-500" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.description}
                      </p>
                    </div>
                    
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    
                    {course.videoUrl && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Video className="w-4 h-4" />
                        Vídeo
                      </div>
                    )}
                    
                    {course.materials && course.materials.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {course.materials.length} material(is)
                      </div>
                    )}
                  </div>

                  {course.topics && course.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {course.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {!isCompleted && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleComplete(course.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Iniciar Curso
                      </Button>
                      
                      {course.materials && course.materials.length > 0 && (
                        <Button size="sm" variant="ghost">
                          <FileText className="w-4 h-4 mr-1" />
                          Materiais
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CourseChecklist;
