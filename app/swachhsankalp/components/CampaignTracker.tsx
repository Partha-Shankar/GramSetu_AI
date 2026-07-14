import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignTrackerProps {
  campaigns: Campaign[];
  onJoin: (id: string) => void;
}

export function CampaignTracker({ campaigns, onJoin }: CampaignTrackerProps) {
  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 dark:bg-neutral-850 dark:text-neutral-350 border border-neutral-200 dark:border-neutral-800">
            Completed
          </span>
        );
      case 'ongoing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900 animate-pulse">
            Active Now
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs h-full">
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-900">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-50">
              Village Cleanliness Campaigns
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs">
          Join community cleanup campaigns to boost village scores and unlock achievements
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map(camp => (
            <Card
              key={camp.id}
              className={`border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/20 rounded-lg flex flex-col justify-between hover:shadow-xs transition-shadow ${
                camp.status === 'completed' ? 'opacity-70' : ''
              }`}
            >
              <CardContent className="p-4 space-y-4">
                {/* Title & Status */}
                <div className="flex justify-between items-start space-x-2">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-150 leading-tight">
                      {camp.title}
                    </h4>
                    <div className="flex items-center space-x-1.5 text-neutral-500 dark:text-neutral-400 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">{camp.date}</span>
                    </div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(camp.status)}</div>
                </div>

                {/* Progress Details */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    <span>Task Completion</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{camp.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        camp.status === 'completed'
                          ? 'bg-neutral-400 dark:bg-neutral-600'
                          : 'bg-blue-600 dark:bg-blue-500'
                      }`}
                      style={{ width: `${camp.progress}%` }}
                    />
                  </div>
                </div>

                {/* Volunteers Joined */}
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Volunteers: <strong className="text-neutral-700 dark:text-neutral-200 font-semibold">{camp.volunteersJoined}</strong> / {camp.targetVolunteers}</span>
                  </span>
                  {camp.userJoined && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-50 dark:fill-emerald-950/20" />
                      <span>Registered</span>
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 mt-0 border-t-0">
                <Button
                  size="sm"
                  variant={camp.userJoined ? 'outline' : 'primary'}
                  disabled={camp.status === 'completed'}
                  onClick={() => onJoin(camp.id)}
                  className={`w-full text-xs h-8.5 ${
                    camp.userJoined
                      ? 'border-emerald-200 hover:bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                      : ''
                  }`}
                >
                  {camp.status === 'completed' ? (
                    'Closed'
                  ) : camp.userJoined ? (
                    'Leave Campaign'
                  ) : (
                    'Volunteer Now'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
