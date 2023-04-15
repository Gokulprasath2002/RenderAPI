// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });

const express = require('express');
const app = express();

const data = {
  name:"Gokul"
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api', (req, res) => {
  const amt =  req.body.amt;
  
  res.send(amt)
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});