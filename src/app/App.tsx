import React from 'react';

import {Calendar} from '../calendar/calendar';

import './App.scss';

export const App: React.FC = () => {
  const [selectedDate, selectDate] = React.useState(new Date());
  return (
    <>
      
      <Calendar selectDate={selectDate} selectedDate={selectedDate} />
    </>
  );
};

export default App;
