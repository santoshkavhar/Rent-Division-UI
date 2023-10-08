import React, { useState } from 'react';
import { Stack, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import './Form.css'; // Import the CSS file for styling

function Form() {
  const [formData, setFormData] = useState({
    renters: 1,
    rooms: 1,
  });

  const [tableData, setTableData] = useState(null);
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
        row.push(
          <TableCell key={j}>
            <TextField
              type="number"
              inputProps={{ min: 0, step: 1 }}
              style={{ width: '100px' }}
            />
          </TableCell>
        );
      }
      table.push(<TableRow key={i}>{row}</TableRow>);
    }

    setTableData(table);
    setShowTable(true);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'https://jsonplaceholder.typicode.com/posts';
      const dataToSend = { formData, tableData }; // Include both formData and tableData
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
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
            Generate Table
          </Button>
        </Stack>
      </form>

      {showTable && (
        <>
          <h3>Generated Table</h3>
          <Table>
            <TableHead>
              <TableRow>
                {Array.from(Array(formData.renters)).map((_, index) => (
                  <TableCell key={index}>Renter {index + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData}
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
