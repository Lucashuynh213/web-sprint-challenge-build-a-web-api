
require('dotenv').config(); // Load .env variables
const server = require('./api/server'); // Import the server setup

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});