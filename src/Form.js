import React, { useState, useEffect } from 'react';
import { Stack, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import './Form.css'; // Import the CSS file for styling

function Form() {
  const [formData, setFormData] = useState({
    renters: 1,
    rooms: 1,
    rentData: [],
  });

  const [showTable, setShowTable] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let intValue = parseInt(value, 10);

    if (!isNaN(intValue) && intValue >= 0) {
      setFormData({ ...formData, [name]: intValue });
    }
  };

  const generateTable = () => {
    const rows = formData.rooms;
    const columns = formData.renters;

    const table = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(0);
      }
      table.push(row);
    }

    setFormData({ ...formData, rentData: table });
    setShowTable(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'http://localhost:5000/api';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data sent successfully!');
        const jsonResponse = await response.json();
        setApiResponse(jsonResponse);
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
          <Button variant="contained" color="primary" onClick={generateTable}>
            Generate Preference Table
          </Button>
        </Stack>
      </form>

      {showTable && (
        <>
          <h3>Preference Table</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Renter/Room </TableCell>
                {Array.from(Array(formData.rooms)).map((_, index) => (
                  <TableCell key={index}>Room {index + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.rentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell component="th" scope="row">
                    Renter {rowIndex + 1}
                  </TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <TextField
                        type="number"
                        value={cell}
                        onChange={(e) => {
                          const updatedRentData = [...formData.rentData];
                          updatedRentData[rowIndex][cellIndex] = parseInt(e.target.value, 10) || 0;
                          setFormData({ ...formData, rentData: updatedRentData });
                        }}
                        inputProps={{ min: 0, step: 1 }}
                        style={{ width: '100px' }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Rent Data
          </Button>
        </>
      )}
      {apiResponse && (
        <div className="api-response-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Renter</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Rent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiResponse.renters?.map((renter, index) => (
                <TableRow key={index}>
                  <TableCell>{renter}</TableCell>
                  <TableCell>{apiResponse.rooms[index]}</TableCell>
                  <TableCell>{apiResponse.rents[index]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Form;
