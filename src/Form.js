import React, { useState } from 'react';
import { Stack, TextField, Button } from '@mui/material';
import './Form.css'; // Import the CSS file for styling

function Form() {
  const [formData, setFormData] = useState({
    renters: 1,
    rooms: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let intValue = parseInt(value, 10);
    
    if (!isNaN(intValue) && intValue >= 0) {
      setFormData({ ...formData, [name]: intValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'https://jsonplaceholder.typicode.com/posts';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data sent successfully!');
      } else {
        console.error('Failed to send data.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Rent Division</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3.5}>
          <TextField
            label="Enter no. of Renters"
            id="renters"
            name="renters"
            type="number"
            value={formData.renters}
            onChange={handleChange}
            inputProps={{ min: 0, step: 1 }}
          />
          <TextField
            label="Enter no. of Rooms"
            id="rooms"
            name="rooms"
            type="number"
            value={formData.rooms}
            onChange={handleChange}
            inputProps={{ min: 0, step: 1 }}
          />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default Form;
