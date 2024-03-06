import React, { useState } from 'react'; // Don't forget to import useState
import logo from './logo.svg';
import './App.css';
import Form from './Form';
import HostelForm from './HostelForm'; // Import HostelForm component

function App() {
  const [displayForm, setDisplayForm] = useState(true); // State to control which form to display

  const handleDisplayChange = () => {
    setDisplayForm(!displayForm); // Toggle the displayForm state
  };

  return (
    <div className="App">
      <div>
        <input type="radio" id="originalForm" name="formType" value="original" checked={displayForm} onChange={handleDisplayChange} />
        <label htmlFor="originalForm">Room Form</label>
      </div>
      <div>
        <input type="radio" id="hostelForm" name="formType" value="hostel" checked={!displayForm} onChange={handleDisplayChange} />
        <label htmlFor="hostelForm">Hostel Form</label>
      </div>
      {displayForm ? <Form /> : <HostelForm />} {/* Conditionally render based on displayForm state */}
    </div>
  );
}

export default App;
