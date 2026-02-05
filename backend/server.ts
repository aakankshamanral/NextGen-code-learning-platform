import express from 'express';
import type { Request, Response } from 'express'; 
import { exec } from 'child_process';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

interface CodeRequest {
  code: string;
  input: string;
}

app.post('/run', (req: Request<{}, {}, CodeRequest>, res: Response) => {
  const { code, input } = req.body;
  const uniqueId = Date.now();
  const filename = `temp_${uniqueId}.c`;
  const binaryName = `out_${uniqueId}`;

  fs.writeFileSync(filename, code);

  const command = `gcc ${filename} -o ${binaryName} && echo "${input}" | ./${binaryName}`;

  exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
    if (fs.existsSync(binaryName)) fs.unlinkSync(binaryName);

    if (error) {
      return res.json({ status: "error", message: stderr || error.message });
    }
    res.json({ status: "success", output: stdout.trim() });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 NextGen Engine running on port ${PORT}`));