
const express = require('express');
const mysql = require('mysql2');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const cors = require('cors');
require('dotenv').config(); 
const multer = require('multer');

// Set up storage for multer 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(cors({
   origin: 'https://hr-connect-full-website-t5gt.vercel.app/'
  //origin:'http://localhost:3000'
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST,      
  user: process.env.DB_USER,      
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,   
 
}).promise();                      

// Reusable function to handle user sign-up
async function signUpUser({ name, username, email, password, role = 'job_seeker' }, res) {
 
  try {
   
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
    
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)', 
        [name, username, email, hashedPassword, role]);

      res.status(200).json({error:"Successfully created"});
    } else {
      res.status(400).json({error:"Username already exists"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
}

// Route for job seeker signup
app.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;
  signUpUser({ name, username, email, password }, res);
});

// Route for recruiter signup
app.post("/signup/recruiter", async (req, res) => {
  const { name, username, email, password } = req.body;
  signUpUser({ name, username, email, password, role: 'recruiter' }, res);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      const check = await bcrypt.compare(password, user.password);

      if (check) {
        const token = jwt.sign({ loggedid: user.id }, 'thepass');
        res.json({ jwtToken: token,role:rows[0].role});
      } else {
        res.status(400).json({error:'Invalid password'});
      }
    } else {
      res.status(400).json({error:'Invalid user'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});


const middle = (req, res, next) => {
  let jwtToken
  const auth = req.headers['authorization']
  if (auth !== undefined) {
    jwtToken = auth.split(' ')[1]
  }
  if (jwtToken !== undefined) {
   jwt.verify(jwtToken, 'thepass', async (error, payload) => {
      if (error) {
        res.status(401)
        res.send('Invalid JWT Token')
      } else {
        req.loggedid=payload.loggedid
        next()
      }
    })
  } else {
    res.status(401)
    res.send('Invalid JWT Token')
  }
}

// route to fetch data from the 'users' table
app.get('/users/:id',  middle,async (req, res) => {
  try {
    const{id}=req.params
    const [rows] = await pool.query('SELECT * FROM users where id=?',[id]);
    res.json({role:rows[0].role,details:rows});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// route to update a user
app.put('/users/:id', middle, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const [result] = await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// route to delete a user
app.delete('/users/:id',middle,async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// job_listings tables crud operations
app.get("/myjobs", middle, async(req,res)=>{  
  try{
     const [rows]=await pool.query('select * from job_listings')
     res.json(rows);
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }
})

app.get("/myjobs/:id",middle,async(req,res)=>{  
  try{
    const {id}=req.params

     const [rows]=await pool.query('select * from job_listings where  recruiter_id = ?',[id])
     res.json(rows);
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }
})

app.post("/myjobs", middle, async(req,res)=>{
  try{
     const{title,description,companyName,location,salary}=req.body
     const {recruiter_id}=req.body
     const company_name=companyName
     await pool.query('INSERT INTO job_listings (title,description,company_name,location,salary,recruiter_id) VALUES (?, ?, ?, ?, ?, ?)',[title,description,company_name,location,salary,recruiter_id])
     res.status(200).send("Successfully created job")
    }
  catch(error){
    res.status(500).json({ error: error.message });
  }
})

app.put("/myjobs/:id", middle, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key, value]) => value !== "")
    );


    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }


    const fields = Object.keys(filteredUpdates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(filteredUpdates);

e
    values.push(id);


    const [result] = await pool.query(`UPDATE job_listings SET ${fields} WHERE id = ?`, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    res.json({ message: "Job listing updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/myjobs/:id',middle,async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM job_listings WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'job not found' });
    }
    res.json({ message: 'job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//resumes table api calls

// POST endpoint for uploading resumes
app.post('/resumes', upload.single('resume'), async (req, res) => {
  const userId = req.body.userId; 
  const fileData = req.file.buffer; 

  try {
    const [result] = await pool.query(
      'INSERT INTO resumes (user_id, file_data) VALUES (?, ?)',
      [userId, fileData]
    );
    res.status(201).json({ message: 'Resume uploaded and created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint for retrieving resumes 
app.get('/users/resumes/:id', middle,  async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await pool.query('SELECT id FROM resumes WHERE user_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
      res.json({rows:rows})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/resumes/:id', middle,  async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM resumes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    const resume = rows[0];
    res.setHeader('Content-Type', 'application/pdf'); // Ensure the correct content type
    res.send(resume.file_data); // Send binary data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// DELETE endpoint for deleting resumes
app.delete('/resumes/:id',  middle, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM resumes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/applications/:id', middle,  async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT 
        applications.id AS application_id,
        applications.cover_letter,
        applications.applied_at,
        users.id AS user_id,
        users.name AS user_name,
        users.email AS user_email,
        resumes.id AS resume_id,
        resumes.file_data
      FROM 
        applications
      JOIN 
        users ON applications.user_id = users.id
      JOIN 
        resumes ON applications.resume_id = resumes.id
      WHERE 
        applications.job_listing_id = ?
    `, [id]);

    if (rows.length === 0) {
    
      return res.status(404).json({ message: 'No applications found for this job listing' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error:', error); 
    res.status(500).json({ error: error.message });
  }
});


// POST endpoint to create a new application
app.post('/applications', middle,  async (req, res) => {
  const { job_listing_id, user_id, resume_id, cover_letter } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO applications (job_listing_id, user_id, resume_id, cover_letter) VALUES (?, ?, ?, ?)',
      [job_listing_id, user_id, resume_id, cover_letter]
    );
    
    res.status(201).json({ message: 'Application created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE endpoint to remove an application by ID
app.delete('/applications/:id', middle,  async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM applications WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.use((err, req, res, next) => {
   console.error(err.stack);  
    res.status(500).send("Something broke!");
});


// Start the server 
const PORT=process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
