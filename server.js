import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Define paths for pre-created files
const tempDir = path.join(__dirname, 'temp');
const languageConfigs = {
  python: { filePath: path.join(tempDir, 'user_code.py'), ImageFIle: 'hyro2070/python-runner' },
  cpp: { filePath: path.join(tempDir, 'user_code.cpp'), ImageFIle: 'hyro2070/cpp-runner' },
  java: { filePath: path.join(tempDir, 'user_code.java'), ImageFIle: 'hyro2070/java-runner' },
  js: { filePath: path.join(tempDir, 'user_code.js'), ImageFIle: 'hyro2070/javascipt-runner' },
};

app.get('/',(req,res)=>{
    res.status(200).json({message:"its working here"})
})


app.post('/execute', async (req, res) => {
  const { code, language } = req.body;
  console.log('Received code for execution:', { language });

  // Validate language
  if (!languageConfigs[language]) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const { filePath, ImageFIle } = languageConfigs[language];
  console.log(filePath);

  try {
    // Overwrite the pre-created file with user-provided code
    fs.writeFileSync(filePath, code);
    console.log(`Code written to file: ${filePath}`);

    // Build Docker image
    const imageName = `${ImageFIle}`;
    console.log(`Building Docker image with name: ${imageName}`);
    // exec(`docker build -f ${dockerfile} -t ${imageName} .`, (buildErr, buildOut) => {
    //   if (buildErr) {
    //     console.error('Docker build error:', buildErr);
    //     return res.status(500).json({ error: 'Failed to build Docker image' });
    //   }

      // Run the code in the Docker container
      console.log(`Running code inside Docker container for image: ${imageName}`);
      exec(`docker run --rm -v "${filePath}:/app/${path.basename(filePath)}" ${imageName}`, (runErr, stdout, stderr) => {
        const lines = stderr.split(/\r\n|\r|\n/);
        if (lines.length > 3) {
          console.error('Program error:', stderr);
          return res.status(400).json({ error: stderr.split('\n')
            .filter(line => !line.includes('Execution Time') && !line.includes('Memory Used'))
            .join('\n').trim() }); // Send only the program error
        }
        if (runErr) {
          console.error('Docker run error:', runErr);
          return res.status(500).json({ error: runErr });
        }

        // If stderr is not empty, send it as a program error

        console.log('Program output:', stdout);
        res.json({ output: stdout.trim() }); // Send program output if no errors
      });
    // });
  } catch (err) {
    console.error('Unexpected server error:', err);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});


app.post('/submit-code', async (req, res) => {
    const { code, language } = req.body;

    if (!languageConfigs[language]) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const { filePath, dockerfile } = languageConfigs[language];

    try {
        // Write user code to file
        fs.writeFileSync(filePath, code);
        console.log(`Code written to file: ${filePath}`);

        // Build Docker image
        const imageName = `${language}-runner`;
        console.log(`Building Docker image: ${imageName}`);
        exec(`docker build -f ${dockerfile} -t ${imageName} .`, (buildErr, buildOut, buildStderr) => {
            if (buildErr) {
                console.error('Docker build error:', buildStderr);
                return res.status(500).json({ error: 'Failed to build Docker image', details: buildStderr });
            }

            // Run the Docker container
            exec(`docker run --rm -v "${filePath}:/app/${path.basename(filePath)}" ${imageName}`, (runErr, stdout, stderr) => {
                if (stderr) {
                    console.error('Program error:', stderr);

                    // Check if stderr contains execution time and memory usage info
                    const executionTimeMatch = stderr.match(/Execution Time:\s*(\d+\.\d+)\s*seconds/);
                    const memoryUsageMatch = stderr.match(/Memory Used:\s*(\d+)\s*KB/);
                    console.log(executionTimeMatch,memoryUsageMatch)
                    const executionTime = executionTimeMatch ? executionTimeMatch[1] : 'N/A';
                    const memoryUsage = memoryUsageMatch ? memoryUsageMatch[1] : 'N/A';
                    const lines = stderr.split(/\r\n|\r|\n/);
                    // console.log("hello"+lines.length)
                    // Check for actual errors in stderr (e.g., exceptions or segmentation faults)
                    if (lines.length > 3) {
                      return res.status(400).json({
                        error: stderr.split('\n')
                        .filter(line => !line.includes('Execution Time') && !line.includes('Memory Used'))
                        .join('\n').trim(),
                        executionTime,
                        memoryUsage,
                        output: "Test case 1: Failed",
                      });
                    }
                    console.log("hello",stdout)  

                    // If no program error, return stderr with execution time and memory usage
                    return res.status(200).json({
                        executionTime,
                        memoryUsage,
                        output: stdout.trim(),
                    });
                }

                // No error, execute successfully
                if (runErr) {
                    console.error('Docker run error:', runErr);
                    return res.status(500).json({ error: runErr });
                }

                console.log('Program output:', stdout);
                return res.json({
                    output: stdout.trim(),
                    executionTime: 'N/A',
                    memoryUsage: 'N/A'
                });
            });
        });
    } catch (err) {
        console.error('Unexpected error during code execution:', err);
        return res.status(500).json({ error: 'Failed to execute code', details: err.message });
    }
});



const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
