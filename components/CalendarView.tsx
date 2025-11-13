
import React, { useState } from 'react';
import type { ScheduledPost } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CalendarViewProps {
  posts: ScheduledPost[];
  onSelectPost: (post: ScheduledPost) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC<CalendarViewProps> = ({ posts, onSelectPost }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getPostsForDay = (day: number) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledAt);
      return postDate.getFullYear() === currentDate.getFullYear() &&
             postDate.getMonth() === currentDate.getMonth() &&
             postDate.getDate() === day;
    });
  };

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="border-r border-b border-border"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const postsForDay = getPostsForDay(day);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    
    calendarDays.push(
      <div key={day} className="p-2 border-r border-b border-border min-h-[120px] flex flex-col">
        <div className={`font-semibold text-sm ${isToday ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>{day}</div>
        <div className="flex-grow mt-1 space-y-1 overflow-y-auto">
            {postsForDay.map(post => {
                const { icon: Icon } = PLATFORM_DETAILS[post.platform];
                return (
                    <button key={post.id} onClick={() => onSelectPost(post)} className="w-full flex items-center gap-1.5 p-1 rounded bg-muted hover:bg-accent text-left">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <p className="text-xs truncate">{post.text}</p>
                    </button>
                )
            })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h2 className="font-bold text-xl">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-accent"><ChevronLeftIcon className="w-5 h-5" /></button>
          <button onClick={handleNextMonth} className="p-1 rounded hover:bg-accent"><ChevronRightIcon className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-border">
        {daysOfWeek.map(day => <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground border-r border-border last:border-r-0">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 flex-grow">
        {calendarDays}
      </div>
    </div>
  );
};
