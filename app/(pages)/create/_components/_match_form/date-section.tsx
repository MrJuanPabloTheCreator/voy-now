
import React, { ChangeEvent, MouseEventHandler, useEffect, useState } from 'react'
import { useMatchForm } from './matchFormContext';
import toast from 'react-hot-toast';
import { getDaysInMonth, startOfMonth, addDays, getDay } from 'date-fns';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

const hoursArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];

const minutesArray = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
];

const TimePicker = ({timeChange}:{timeChange: string}) => {
    const { matchForm, setMatchForm } = useMatchForm();

    let selectedValue: Date;
    let hour: number;
    let minutes;
    let period;

    if(timeChange === 'start'){
        selectedValue = matchForm.start_date;
    } else {
        selectedValue = matchForm.end_date;
    }

    hour = selectedValue.getHours() % 12;
    if (hour === 0) {
        hour = 12;
    }
    minutes = selectedValue.getMinutes();
    period = selectedValue.getHours() >= 12 ? 'PM' : 'AM';


    const handleHourChange = ({e, hourSelected}: {e: ChangeEvent<HTMLSelectElement>, hourSelected: number}) => {
        e.preventDefault();

        const updatedHours = new Date(selectedValue);
        updatedHours.setHours(hourSelected);
        if (timeChange === 'start') {
            setMatchForm({ ...matchForm, start_date: updatedHours });
        } else {
            setMatchForm({ ...matchForm, end_date: updatedHours });
        }
    }

    const handleMinuteChange = ({e, minuteSelected}: {e: ChangeEvent<HTMLSelectElement>, minuteSelected: number}) => {
        e.preventDefault();

        const updatedMinutes = new Date(selectedValue);
        updatedMinutes.setMinutes(minuteSelected);
        if (timeChange === 'start') {
            setMatchForm({ ...matchForm, start_date: updatedMinutes });
        } else {
            setMatchForm({ ...matchForm, end_date: updatedMinutes });
        }
    }

    const handleDayTimeToggle:MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        const updatedTime = new Date(selectedValue);

        if (selectedValue.getHours() >= 12) {
            updatedTime.setHours(updatedTime.getHours() - 12);
        } else {
            updatedTime.setHours(updatedTime.getHours() + 12);
        }

        if (timeChange === 'start') {
            setMatchForm({ ...matchForm, start_date: updatedTime });
        } else {
            setMatchForm({ ...matchForm, end_date: updatedTime });
        }
    }

    return (
        <div className='flex items-center justify-center rounded-3xl h-fit p-1 space-x-1 border-2 border-white/10'>
            <select className='py-1 pl-1 text-white/40 bg-zdark outline-none' value={hour} onChange={(e) => handleHourChange({e, hourSelected: Number(e.target.value)})}>
                {hoursArray.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>
            <select className='py-1 pl-1 text-white/40 bg-zdark outline-none' value={minutes} onChange={(e) => handleMinuteChange({e, minuteSelected: Number(e.target.value)})}>
                {minutesArray.map((item, index) => (
                    <option key={index} value={item}>
                        <span>{item}</span>
                    </option>
                ))}
            </select>
            <button className={`flex w-14 p-1 border-2 border-white/10 relative transition-colors duration-300 rounded-full ${selectedValue.getHours() < 12 ? '':'bg-white/10'}`} onClick={handleDayTimeToggle}>
                <span className={`absolute font-semibold transform transition-transform duration-300 text-sm ${selectedValue.getHours() < 12 ? 'translate-x-6 text-white/40':'text-zdgreen'}`}>{selectedValue.getHours() < 12 ? 'am': 'pm'}</span>
                <span className={`p-[10px] transform rounded-full transition-transform duration-300 bg-zdgreen ${selectedValue.getHours() < 12 ? '':'translate-x-6'}`}/>
            </button>
        </div>
    )
}

const DateSection = () => {
    const { matchForm, setMatchForm } = useMatchForm();
    const [activeMonth, setActiveMonth] = useState<Date>(new Date);
    const [dates, setDates] = useState<Date[]>([]);

    const currentDate = new Date();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const day = Array.from({length: getDay(activeMonth) + 1})

    const handleMonthChange = ({ e, direction }: { e: React.MouseEvent<HTMLButtonElement>; direction: 'back' | 'for' }) => {
        e.preventDefault();

        if(direction === 'back'){
            console.log(activeMonth, currentDate)
            if(activeMonth > currentDate){
                const newDate = activeMonth.setMonth(activeMonth.getMonth() - 1)
                setActiveMonth(new Date(newDate))
            }
        } else {
            // chekc if it is more than a year
            const newDate = activeMonth.setMonth(activeMonth.getMonth() + 1)
            setActiveMonth(new Date(newDate))
        }
    }

    const handleDaySelect = ({ e, daySelected }: { e: React.MouseEvent<HTMLButtonElement>; daySelected: Date }) => {
        e.preventDefault();

        const updatedStartDate = new Date(daySelected);
        updatedStartDate.setHours(matchForm.start_date.getHours());
        updatedStartDate.setMinutes(matchForm.start_date.getMinutes());

        const updatedEndDate = new Date(daySelected);
        updatedEndDate.setHours(matchForm.end_date.getHours());
        updatedEndDate.setMinutes(matchForm.end_date.getMinutes());

        setMatchForm({
            ...matchForm,
            start_date: updatedStartDate,
            end_date: updatedEndDate,
        });
    }

    useEffect(() => {
        const firstDayOfMonth = startOfMonth(activeMonth);
        setDates(Array.from({ length: getDaysInMonth(activeMonth) }, (_, index) => addDays(firstDayOfMonth, index)));
    },[activeMonth])

    return (
        <div className="flex w-full justify-between">
            <div className='p-2 rounded-lg bg-white/10'>
                <div className='flex justify-between py-1'>
                    <button onClick={(e) => handleMonthChange({ e, direction: 'back' })}><ChevronsLeft size={28} className='p-1 text-white/40 rounded-md bg-zdark'/></button>
                    <span className='text-white font-semibold'>{activeMonth.toLocaleDateString('default', { month: 'long' })} {activeMonth.toLocaleDateString('default', { year: 'numeric' })}</span>
                    <button onClick={(e) => handleMonthChange({ e, direction: 'for' })}><ChevronsRight size={28} className='p-1 text-white/40 rounded-md bg-zdark'/></button>
                </div>
                <div className='grid grid-cols-7 gap-1'>
                    {daysOfWeek.map((item, index) => 
                        <div key={index} className='flex justify-center'>
                            <span className='text-zdgreen font-semibold'>{item}</span>
                        </div>
                    )}
                    {day.map((_, index) => <div key={index}/>)}
                    {dates.map((date, index) => (
                        <button 
                            key={index} 
                            className={`py-1 px-2 rounded-md ${matchForm.start_date && matchForm.start_date.getDate() === date.getDate() && matchForm.start_date.getMonth() === date.getMonth() && matchForm.start_date.getFullYear() === date.getFullYear() ? 'bg-zdgreen text-zdark':'bg-zdark text-white/40'}`}
                            onClick={(e) => handleDaySelect({e, daySelected: date})}
                        >
                            {date.getDate()}
                        </button>
                    ))}
                </div>
            </div>
            <div className='flex flex-col flex-grow items-center space-y-20'>
                <div className='flex flex-col space-y-4 items-end'>
                    <div className='flex items-center space-x-2'>
                        <h2 className='text-white font-semibold'>From</h2>
                        <TimePicker timeChange={'start'}/>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <h2 className='text-white font-semibold'>To</h2>
                        <TimePicker timeChange={'end'}/>
                    </div>    
                </div>
                <div className='flex flex-col items-center space-y-1'>
                    <div className='flex text-white/40 font-semibold space-x-1'>
                        <span>{matchForm.start_date.toLocaleDateString('default', { day: 'numeric' })}</span>
                        <span>{matchForm.start_date.toLocaleDateString('default', { month: 'long' })}</span>
                        <span>{matchForm.start_date.toLocaleDateString('default', { year: 'numeric' })}</span>
                    </div>
                    <div className='flex text-white/40 font-semibold'>
                        <span>{matchForm.start_date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span> -
                        <span>{matchForm.end_date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default DateSection;