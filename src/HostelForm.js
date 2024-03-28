import React, { useState } from 'react';
import { Stack, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import './Form.css'; // Import the CSS file for styling

function HostelForm() {
  const [formData, setFormData] = useState({
    renters: 1,
    floors: 1,
    rent: 1,
    rentData: [[]], // Initialize with an empty array for the hostelRent row
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

  const handleStringChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateTable = () => {
    const rows = formData.renters;
    const columns = formData.floors;

    const table = [];
    // Add the capacity row
    const capacityRow = Array(columns).fill("");
    table.push(capacityRow);

    // Add the floor names row
    const floorNamesRow = Array.from(Array(columns), (_, index) => `Floor ${index + 1}`);
    table.push(floorNamesRow);

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
      const url = 'http://localhost:5000/rent';
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
            inputProps={{ min: 1, step: 1 }}
          />
          <TextField
            label="Enter no. of Floors"
            id="floors"
            name="floors"
            type="number"
            value={formData.floors}
            onChange={handleChange}
            inputProps={{ min: 1, step: 1 }}
          />
          <TextField
            label="Enter total rent"
            id="rent"
            name="rent"
            type="number"
            value={formData.rent}
            onChange={handleChange}
            inputProps={{ min: 1, step: 1 }}
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
                <TableCell> Renter/Floor </TableCell>
                {Array.from(Array(formData.floors)).map((_, index) => (
                  <TableCell key={index}>Floor {index + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.rentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell component="th" scope="row">
                    {rowIndex === 0 ? "Capacity" : rowIndex === 1 ? "Floor Names" : `Renter ${rowIndex - 1}`}
                  </TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <TextField
                        value={cell}
                        onChange={(e) => {
                          const updatedRentData = [...formData.rentData];
                          updatedRentData[rowIndex][cellIndex] = e.target.value;
                          setFormData({ ...formData, rentData: updatedRentData });
                        }}
                        style={{ width: '100px' }}
                        inputProps={{ min: 1, step: 1, pattern: "[0-9]*", title: "Please enter a positive integer" }}
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
                <TableCell>Floor</TableCell>
                <TableCell>Rent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiResponse.renters?.map((renter, index) => (
                <TableRow key={index}>
                  <TableCell>{renter}</TableCell>
                  <TableCell>{apiResponse.floors[index]}</TableCell>
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

export default HostelForm;
