import axios from 'axios';
// When submitting the reservation form, include the token in the headers
const token = localStorage.getItem('token');
const headers = token ? { Authorization: `Bearer ${token}` } : {};

axios.post('http://localhost:5000/api/reservations', {
  // Add your form data properties here
  checkInDate: '',
  checkOutDate: '',
  numberOfGuests: 0,
  roomType: '',
  // Add other required reservation fields
}, { headers })
  .then(response => {
    // Handle success
  })
  .catch(error => {
    // Handle error
  });