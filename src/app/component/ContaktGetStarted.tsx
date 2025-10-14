import React, { useEffect, useState } from 'react';
import { ConstUserTask as tasks } from '@/lib/constants/getstarted.constant';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const ContaktGetStarted = () => {
  // Simulate a data store for completed tasks
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    // Initialize from local storage or a default state
    const savedState = localStorage.getItem('getStartedChecklist');
    return savedState ? JSON.parse(savedState) : {};
  });
  const [progress, setProgress] = useState(0);

  const handleCheckboxChange = (taskId: string, checked: boolean) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: checked,
    }));
  };

  useEffect(() => {
    const completedCount = Object.values(completedTasks).filter(Boolean).length;
    const newProgress = (completedCount / tasks.length) * 100;
    setProgress(newProgress);
    // Save state to local storage
    localStorage.setItem('getStartedChecklist', JSON.stringify(completedTasks));
  }, [completedTasks]);

  return (
    <div className='max-w-md mx-auto flex flex-col gap-2'>
      <h6 className='font-semibold text-neutral-800'>Get started</h6>
      <p className='text-base leading-5 text-neutral-base'>
        Setup the following to use Contakt effectively and supercharge your sales.
      </p>
      <div className='mb-6'>
        <Progress value={progress} className='bg-gray-200 [&>div]:bg-success-base w-full h-2' />
      </div>
      <div className='space-y-6'>
        {tasks.map((task) => (
          <div key={task.value} className='flex items-center space-x-2'>
            <Checkbox
              id={task.value}
              checked={completedTasks[task.value] || false}
              onCheckedChange={(checked) => handleCheckboxChange(task.value, checked as boolean)}
            />
            <Label htmlFor={task.value} className='text-base text-neutral-base cursor-pointer'>
              {task.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContaktGetStarted;
