
import React, { useState, useEffect } from 'react';
import type { PostData } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import { CalendarIcon } from './icons/CalendarIcon';

interface ScheduleModalProps {
  data: PostData | null;
  onClose: () => void;
  onSchedule: (post: PostData, date: Date) => void;
}

// Function to get the default schedule time (e.g., 1 hour from now)
const getDefaultScheduleTime = () => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
};

// Function to format a date object into YYYY-MM-DD and HH:MM for input fields
const formatDateTimeForInputs = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { date: `${year}-${month}-${day}`, time: `${hours}:${minutes}` };
};

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ data, onClose, onSchedule }) => {
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
        const defaultTime = getDefaultScheduleTime();
        const { date, time } = formatDateTimeForInputs(defaultTime);
        setScheduleDate(date);
        setScheduleTime(time);
        setError(null);
    }
  }, [data]);

  if (!data) return null;

  const { platform, text } = data;
  const { icon: Icon, color } = PLATFORM_DETAILS[platform];

  const handleScheduleClick = () => {
    if (!scheduleDate || !scheduleTime) {
      setError('Please select both a date and a time.');
      return;
    }

    const combinedDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    if (combinedDateTime <= new Date()) {
      setError('Please select a time in the future.');
      return;
    }

    onSchedule(data, combinedDateTime);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-lg shadow-2xl w-full max-w-md flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
            <div className={`flex items-center gap-3 mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
                <h3 className="font-bold text-lg text-card-foreground">Schedule Post for {platform}</h3>
            </div>
            <div className="bg-muted border border-border rounded-lg p-3 max-h-32 overflow-y-auto mb-4">
                <p className="text-muted-foreground whitespace-pre-wrap text-sm line-clamp-3">{text}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date-picker" className="block text-sm font-semibold text-foreground mb-1">Date</label>
                    <input 
                        type="date"
                        id="date-picker"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={formatDateTimeForInputs(new Date()).date}
                        className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                </div>
                <div>
                    <label htmlFor="time-picker" className="block text-sm font-semibold text-foreground mb-1">Time</label>
                    <input
                        type="time"
                        id="time-picker"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                </div>
            </div>
             {error && <p className="text-sm text-destructive mt-3 text-center">{error}</p>}
        </div>

        <div className="bg-muted px-6 py-4 flex justify-end gap-3 rounded-b-lg border-t border-border">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-secondary text-secondary-foreground hover:opacity-90 transition"
            >
                Cancel
            </button>
            <button
                onClick={handleScheduleClick}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
            >
                <CalendarIcon className="w-4 h-4" />
                Schedule
            </button>
        </div>
      </div>
    </div>
  );
};