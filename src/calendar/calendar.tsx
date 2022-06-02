import React from 'react';

import {useCalendar} from '../hooks/useCalendar';

import './calendar.scss';
import {checkDateIsEqual, checkIsToday, formateDate} from './utils/helpers/date';

interface CalendarProps {
  locale?: string;
  selectedDate: Date;
  selectDate: (date: Date) => void;
  firstWeekDay?: number;
}

export const Calendar: React.FC<CalendarProps> = ({
  locale = 'default',
  firstWeekDay = 2,
  selectDate,
  selectedDate,
}) => {
  const {state, functions} = useCalendar({firstWeekDay, locale, selectedDate});
  const [open, setOpen] = React.useState(false);
  const [rangeDate, setRangeDate] = React.useState([''])
  const classNameWrapper = `calendar__wrapper${open ? ' active' : ''}`;

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="calendar">
      <div className="calendar__date-now" onClick={handleOpen}>
        {formateDate(selectedDate, 'DD MM YYYY')}
      </div>
      <div className={classNameWrapper}>
        {' '}
        <div className="calendar__header">
          <div
            aria-hidden
            className="calendar__arrow-left"
            onClick={() => functions.onClickArrow('left')}></div>
          {state.mode === 'days' && (
            <div onClick={() => functions.setMode('monthes')}>
              {state.monthesNames[state.selectedMonth.monthIndex].month} {state.selectedYear}
            </div>
          )}
          {state.mode === 'monthes' && (
            <div aria-hidden onClick={() => functions.setMode('years')}>
              {state.selectedYear}
            </div>
          )}
          {state.mode === 'years' && (
            <div>
              {state.selectedYearInterval[0]} -{' '}
              {state.selectedYearInterval[state.selectedYearInterval.length - 1]}
            </div>
          )}
          <div
            aria-hidden
            className="calendar__arrow-right"
            onClick={() => functions.onClickArrow('right')}></div>
        </div>
        <div className="calendar__body">
          {state.mode === 'days' && (
            <>
              <div className="calendar__week-names">
                {state.weekDaysNames.map((weekDaysName) => (
                  <div key={weekDaysName.dayShort}>{weekDaysName.dayShort}</div>
                ))}
              </div>
              <div className="calendar__days">
                {state.calendarDays.map((day) => {
                  const isToday = checkIsToday(day.date);
                  const isSelectedDay = checkDateIsEqual(day.date, state.selectedDate.date);
                  const isAdditionalDay = day.monthIndex !== state.selectedMonth.monthIndex;

                  return (
                    <div
                      aria-hidden
                      onClick={() => {
                        functions.setSelectedDay(day);
                        selectDate(day.date);
                      }}
                      key={`${day.dayNumber}-${day.monthIndex}`}
                      className={[
                        'calendar__day',
                        isToday ? 'calendar__today-item' : '',
                        isSelectedDay ? 'calendar__selected-item' : '',
                        isAdditionalDay ? 'calendar__additional-day' : '',
                      ].join(' ')}>
                      {day.dayNumber}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {state.mode === 'monthes' && (
            <div className="calendar__pick-items">
              {state.monthesNames.map((monthesName) => {
                const isCurrentMonth =
                  new Date().getMonth() === monthesName.monthIndex &&
                  new Date().getFullYear() === state.selectedYear;
                const isSelectedMonth = monthesName.monthIndex === state.selectedMonth.monthIndex;

                return (
                  <div
                    aria-hidden
                    onClick={() => {
                      functions.setSelectedMonthByIndex(monthesName.monthIndex);
                      functions.setMode('days');
                    }}
                    className={[
                      'calendar__pick-item',
                      isCurrentMonth ? 'calendar__today-item' : '',
                      isSelectedMonth ? 'calendar__selected-item' : '',
                    ].join(' ')}>
                    {monthesName.monthShort}
                  </div>
                );
              })}
            </div>
          )}
          {state.mode === 'years' && (
            <div className="calendar__pick-items">
              <div className="calendar__unchoosable-year">{state.selectedYearInterval[0] - 1}</div>
              {state.selectedYearInterval.map((year) => {
                const isCurrentYear = new Date().getFullYear() === year;
                const isSelectedYear = year === state.selectedYear;

                return (
                  <div
                    key={year}
                    aria-hidden
                    onClick={() => {
                      functions.setSelectedYear(year);
                      functions.setMode('monthes');
                    }}
                    className={[
                      'calendar__pick-item',
                      isCurrentYear ? 'calendar__today-item' : '',
                      isSelectedYear ? 'calendar__selected-item' : '',
                    ].join(' ')}>
                    {year}
                  </div>
                );
              })}
              <div className="calendar__unchoosable-year">
                {state.selectedYearInterval[state.selectedYearInterval.length - 1] + 1}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
