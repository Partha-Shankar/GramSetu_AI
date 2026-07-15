import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, Plus } from 'lucide-react';
import { ChecklistTask } from '../types';

interface ChecklistManagerProps {
  tasks: ChecklistTask[];
  onToggle: (id: string) => void;
  onAddTask: (title: string, category: string, impact: number) => void;
}

export function ChecklistManager({ tasks, onToggle, onAddTask }: ChecklistManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sanitation');
  const [newImpact, setNewImpact] = useState(15);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle, newCategory, Number(newImpact));
    setNewTitle('');
    setIsAdding(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'sanitation':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
      case 'waste management':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900';
      case 'community':
        return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900';
      case 'awareness':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900';
      case 'environment':
        return 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700';
    }
  };

  return (
    <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs h-full">
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-900">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-50">
              Cleanliness Activities Checklist
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Check tasks off as they are completed to update the score
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant={isAdding ? 'secondary' : 'outline'}
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs h-8 px-2.5 flex items-center space-x-1 border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Cancel' : 'Add Task'}</span>
          </Button>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
            <span>Progress: {completedCount} of {totalCount} completed</span>
            <span>{completionPercent}%</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Add Task Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="p-4 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20 space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Task Title
              </label>
              <input
                type="text"
                placeholder="e.g. Sweep marketplace courtyard..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                className="w-full text-sm px-3 py-1.5 rounded-md border border-neutral-200 bg-white text-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-neutral-200 bg-white text-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                >
                  <option value="Sanitation">Sanitation</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Community">Community</option>
                  <option value="Awareness">Awareness</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  Score Weight (Impact)
                </label>
                <select
                  value={newImpact}
                  onChange={e => setNewImpact(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-neutral-200 bg-white text-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                >
                  <option value="5">Low (5%)</option>
                  <option value="10">Medium-Low (10%)</option>
                  <option value="15">Medium (15%)</option>
                  <option value="20">High (20%)</option>
                  <option value="25">Critical (25%)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" className="text-xs h-8">
                Save Activity
              </Button>
            </div>
          </form>
        )}

        {/* Tasks List */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-900 max-h-[380px] overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="p-6 text-center text-sm text-neutral-400">
              No tasks defined. Add a task to get started!
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                onClick={() => onToggle(task.id)}
                className={`flex items-start justify-between p-4 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors ${
                  task.completed ? 'bg-neutral-50/20 dark:bg-neutral-900/5' : ''
                }`}
              >
                <div className="flex items-start space-x-3 pr-2">
                  <div className="mt-0.5 text-neutral-400 hover:text-blue-600 transition-colors shrink-0">
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    ) : (
                      <Square className="w-5 h-5 border-neutral-300 dark:border-neutral-700" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium transition-all ${
                        task.completed
                          ? 'line-through text-neutral-400 dark:text-neutral-500'
                          : 'text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                        Impact: +{task.scoreImpact}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
