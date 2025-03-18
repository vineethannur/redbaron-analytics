const http = require('http');

// Function to check if server is running
function checkServer(port) {
  console.log(`Checking if server is running on port ${port}...`);
  
  const options = {
    host: 'localhost',
    port: port,
    path: '/',
    timeout: 2000
  };
  
  const req = http.get(options, (res) => {
    console.log(`Server is running! Status code: ${res.statusCode}`);
    console.log('Server connection successful!');
    process.exit(0);
  });
  
  req.on('error', (err) => {
    console.error('Server connection error:');
    console.error(`- Error: ${err.message}`);
    
    if (err.code === 'ECONNREFUSED') {
      console.error('\nThe server is not running or not accessible.');
      console.error('Please make sure:');
      console.error('1. You have started the server with "npm start"');
      console.error('2. The server is running on port 3001');
      console.error('3. There are no firewall issues blocking the connection');
      console.error('\nTo start the server, run:');
      console.error('cd backend');
      console.error('npm start');
    }
    
    process.exit(1);
  });
  
  req.on('timeout', () => {
    console.error('Connection timeout!');
    console.error('The server is taking too long to respond.');
    req.abort();
    process.exit(1);
  });
}

// Check server on port 3001
checkServer(3001); 