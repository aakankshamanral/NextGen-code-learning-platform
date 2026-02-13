import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);
const app = express();
app.use(cors({
  origin: "*", // In production, replace with your actual frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

app.post('/run', async (req, res) => {
  const { code, language, input = "" } = req.body;
  
  if (language !== 'c') {
    return res.status(400).json({ error: "Only C is supported for now" });
  }

  const jobId = Math.random().toString(36).substring(7);
  const fileName = `code_${jobId}.c`;
  const outputName = `out_${jobId}`;
  const filePath = path.join(__dirname, fileName);

  try {
    // 1. Write the code to a file
    fs.writeFileSync(filePath, code);

    // 2. Compile the code
    await execPromise(`gcc ${filePath} -o ${outputName}`);

    // 3. Execute the code with input and a 2-second timeout
    // Using 'echo' to pipe input into the compiled binary
    const { stdout, stderr } = await execPromise(`echo "${input}" | ./${outputName}`, {
      timeout: 2000, 
      maxBuffer: 1024 * 512 // 512KB limit
    });

    res.json({ output: stdout, stderr });

  } catch (err: any) {
    res.status(400).json({ 
      error: err.stderr || err.message || "Execution failed" 
    });
  } finally {
    // 4. Cleanup files immediately for speed/storage
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(outputName)) fs.unlinkSync(outputName);
  }
});

app.listen(5000, () => console.log('🚀 Compiler Engine running on port 5000'));