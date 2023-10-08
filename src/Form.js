import React, { useState } from 'react';
import { Stack, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import './Form.css'; // Import the CSS file for styling

function Form() {
  const [formData, setFormData] = useState({
    renters: 1,
    rooms: 1,
    tableData: [], // Initialize an empty array to hold table data
  });

  const [showTable, setShowTable] = useState(false);

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
        row.push(0); // Initialize each cell with 0 (or any default value)
      }
      table.push(row);
    }

    setFormData({ ...formData, tableData: table }); // Update formData with tableData
    setShowTable(true);
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
                <TableCell> Room/Renter </TableCell>
                {Array.from(Array(formData.renters)).map((_, index) => (
                  <TableCell key={index}>Renter {index + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.tableData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell component="th" scope="row">
                    Room {rowIndex + 1}
                  </TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <TextField
                        type="number"
                        value={cell}
                        onChange={(e) => {
                          const updatedTableData = [...formData.tableData];
                          updatedTableData[rowIndex][cellIndex] = parseInt(e.target.value, 10) || 0;
                          setFormData({ ...formData, tableData: updatedTableData });
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
            Submit Table Data
          </Button>
        </>
      )}
    </div>
  );
}

export default Form;
