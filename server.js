import express from 'express';
// import cors from 'cors';
import { exec as rawExec } from 'child_process';
import { performance } from 'perf_hooks';
import util from 'util';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';


// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// app.use(express.json());
app.use(express.json({ limit: '256kb' }));
const exec = util.promisify(rawExec);  
// Define paths for pre-created files
const tempDir = path.join(__dirname, 'temp');
const languageConfigs = {
  python: { filePath: path.join(tempDir, 'user_code.py'), dockerfile: 'Dockerfiles/Dockerfile.python' },
  cpp: { filePath: path.join(tempDir, 'user_code.cpp'), dockerfile: 'Dockerfiles/Dockerfile.cpp' },
  java: { filePath: path.join(tempDir, 'user_code.java'), dockerfile: 'Dockerfiles/Dockerfile.java' },
  js: { filePath: path.join(tempDir, 'user_code.js'), dockerfile: 'Dockerfiles/Dockerfile.js' },
};

app.get('/',(req,res)=>{
    res.status(200).json({message:"its working here"})
})


// app.post('/execute', async (req, res) => {
//   const { code, language } = req.body;
//   console.log('Received code for execution:', { language });

//   // Validate language
//   if (!languageConfigs[language]) {
//     return res.status(400).json({ error: 'Unsupported language' });
//   }

//   const { filePath, dockerfile } = languageConfigs[language];
//   console.log(filePath);

//   try {
//     // Overwrite the pre-created file with user-provided code
//     fs.writeFileSync(filePath, code);
//     console.log(`Code written to file: ${filePath}`);

//     // Build Docker image
//     const imageName = `${language}-runner`;
//     console.log(`Building Docker image with name: ${imageName}`);
//     exec(`docker build -f ${dockerfile} -t ${imageName} .`, (buildErr, buildOut) => {
//       if (buildErr) {
//         console.error('Docker build error:', buildErr);
//         return res.status(500).json({ error: 'Failed to build Docker image' });
//       }

//       // Run the code in the Docker container
//       console.log(`Running code inside Docker container for image: ${imageName}`);
//       exec(`docker run --rm -v "${filePath}:/app/${path.basename(filePath)}" ${imageName}`, (runErr, stdout, stderr) => {
//         const lines = stderr.split(/\r\n|\r|\n/);
//         if (lines.length > 3) {
//           console.error('Program error:', stderr);
//           return res.status(400).json({ error: stderr.split('\n')
//             .filter(line => !line.includes('Execution Time') && !line.includes('Memory Used'))
//             .join('\n').trim() }); // Send only the program error
//         }
//         if (runErr) {
//           console.error('Docker run error:', runErr);
//           return res.status(500).json({ error: runErr });
//         }

//         // If stderr is not empty, send it as a program error

//         console.log('Program output:', stdout);
//         res.json({ output: stdout.trim() }); // Send program output if no errors
//       });
//     });
//   } catch (err) {
//     console.error('Unexpected server error:', err);
//     res.status(500).json({ error: 'Failed to execute code' });
//   }
// });






// app.post('/submit-code', async (req, res) => {
//     const { code, language } = req.body;

//     if (!languageConfigs[language]) {
//         return res.status(400).json({ error: 'Unsupported language' });
//     }

//     const { filePath, dockerfile } = languageConfigs[language];

//     try {
//         // Write user code to file
//         fs.writeFileSync(filePath, code);
//         console.log(`Code written to file: ${filePath}`);

//         // Build Docker image
//         const imageName = `${language}-runner`;
//         console.log(`Building Docker image: ${imageName}`);
//         exec(`docker build -f ${dockerfile} -t ${imageName} .`, (buildErr, buildOut, buildStderr) => {
//             if (buildErr) {
//                 console.error('Docker build error:', buildStderr);
//                 return res.status(500).json({ error: 'Failed to build Docker image', details: buildStderr });
//             }

//             // Run the Docker container
//             exec(`docker run --rm -v "${filePath}:/app/${path.basename(filePath)}" ${imageName}`, (runErr, stdout, stderr) => {
//                 if (stderr) {
//                     console.error('Program error:', stderr);

//                     // Check if stderr contains execution time and memory usage info
//                     const executionTimeMatch = stderr.match(/Execution Time:\s*(\d+\.\d+)\s*seconds/);
//                     const memoryUsageMatch = stderr.match(/Memory Used:\s*(\d+)\s*KB/);
//                     console.log(executionTimeMatch,memoryUsageMatch)
//                     const executionTime = executionTimeMatch ? executionTimeMatch[1] : 'N/A';
//                     const memoryUsage = memoryUsageMatch ? memoryUsageMatch[1] : 'N/A';
//                     const lines = stderr.split(/\r\n|\r|\n/);
//                     // console.log("hello"+lines.length)
//                     // Check for actual errors in stderr (e.g., exceptions or segmentation faults)
//                     if (lines.length > 3) {
//                       return res.status(400).json({
//                         error: stderr.split('\n')
//                         .filter(line => !line.includes('Execution Time') && !line.includes('Memory Used'))
//                         .join('\n').trim(),
//                         executionTime,
//                         memoryUsage,
//                         output: "Test case 1: Failed",
//                       });
//                     }
//                     console.log("hello",stdout)  

//                     // If no program error, return stderr with execution time and memory usage
//                     return res.status(200).json({
//                         executionTime,
//                         memoryUsage,
//                         output: stdout.trim(),
//                     });
//                 }

//                 // No error, execute successfully
//                 if (runErr) {
//                     console.error('Docker run error:', runErr);
//                     return res.status(500).json({ error: runErr });
//                 }

//                 console.log('Program output:', stdout);
//                 return res.json({
//                     output: stdout.trim(),
//                     executionTime: 'N/A',
//                     memoryUsage: 'N/A'
//                 });
//             });
//         });
//     } catch (err) {
//         console.error('Unexpected error during code execution:', err);
//         return res.status(500).json({ error: 'Failed to execute code', details: err.message });
//     }
// });


// app.post(['/execute', '/submit-code'], async (req, res) => {
//   const { code, language } = req.body;
//   if (!languageConfigs[language]) {
//     return res.status(400).json({ error: 'Unsupported language' });
//   }

//   const { filePath } = languageConfigs[language];
//   fs.writeFileSync(filePath, code);

//   let command = '';
//   const filename = path.basename(filePath);

//   switch (language) {
//     case 'cpp':
//       command = `/usr/bin/time -f "Execution Time: %e seconds\nMemory Used: %M KB" g++ ${filePath} -o ${tempDir}/a.out && ${tempDir}/a.out`;
//       break;
//     case 'python':
//       command = `python3 ${filePath}`;
//       break;
//     case 'js':
//       command = `node ${filePath}`;
//       break;
//     case 'java':
//       const className = filename.replace('.java', '');
//       command = `javac ${filePath} && java -cp ${tempDir} ${className}`;
//       break;
//     default:
//       return res.status(400).json({ error: 'Unsupported language' });
//   }

//   exec(command, (err, stdout, stderr) => {
//     if (err || stderr.includes('error')) {
//       return res.status(400).json({
//         error: stderr.split('\n')
//           .filter(line => !line.includes('Execution Time') && !line.includes('Memory Used'))
//           .join('\n').trim(),
//         output: 'Test case 1: Failed',
//       });
//     }

//     const executionTime = (stderr.match(/Execution Time: (.+?) seconds/) || [])[1] || 'N/A';
//     const memoryUsage = (stderr.match(/Memory Used: (.+?) KB/) || [])[1] || 'N/A';

//     res.status(200).json({
//       output: stdout.trim(),
//       executionTime,
//       memoryUsage,
//     });
//   });
// });

/* ---------- helpers ---------- */
function buildCommand(filePath, language) {
  switch (language) {
    case 'cpp':
      return `/usr/bin/time -f "Execution Time: %e seconds\nMemory Used: %M KB" \
g++ ${filePath} -o ${tempDir}/a.out && ${tempDir}/a.out`;
    case 'python':
      return `python3 ${filePath}`;
    case 'js':
      return `node ${filePath}`;
    case 'java': {
      const className = path.basename(filePath, '.java');
      return `javac ${filePath} && java -cp ${tempDir} ${className}`;
    }
    default:
      throw new Error('Unsupported language');
  }
}

const pick = (s, re) => (s.match(re) || [])[1] || 'N/A';
const clean = s =>
  s.split('\n')
   .filter(l => !/Execution Time|Memory Used/.test(l))
   .join('\n')
   .trim();

/* ---------- ONE handler used by both endpoints ---------- */
async function runCode(req, res) {
  const startTime = performance.now();
  console.log('Received request for /runCode');

  const { code = '', language = '' } = req.body || {};

  /* 1. Validate language */
  const cfg = languageConfigs[language];
  if (!cfg) {
    console.log('Unsupported language received:', language);
    return res.status(400).json({ error: 'Unsupported language' });
  }
  console.log(`Language validated: ${language}`);

  try {
    /* 2. Write code to its temp file */
    await fs.promises.mkdir(tempDir, { recursive: true });
    await fs.promises.writeFile(cfg.filePath, code);
    const writeTime = performance.now();
    console.log(`File written in ${((writeTime - startTime) / 1000).toFixed(2)}s`);

    /* 3. Build the shell command */
    const cmd = buildCommand(cfg.filePath, language);
    console.log(`Executing command: ${cmd}`);

    /* 4. Exec with hard limits */
    const { stdout, stderr } = await exec(cmd, {
      timeout: 15000, // Increased to 15s
      maxBuffer: 1024 * 1024 // 1 MiB
    });
    
    const execTime = performance.now();
    console.log(`Command executed in ${((execTime - writeTime) / 1000).toFixed(2)}s`);

    return res.json({
      output: stdout.trim(),
      executionTime: pick(stderr, /Execution Time:\s*(.+?)\s*seconds/),
      memoryUsage:   pick(stderr, /Memory Used:\s*(.+?)\s*KB/)
    });

  } catch (err) {
    const errorTime = performance.now();
    console.error(`Error after ${((errorTime - startTime) / 1000).toFixed(2)}s:`, err);

    /* Timeout → err.killed === true, compile/runtime error → err.code */
    const status = err.killed ? 408 : 400; // 408 for Request Timeout
    const stderr = err.stderr || err.message || '';
    return res.status(status).json({ error: clean(stderr) });
  }
}

/* ---------- the two routes ------------------------------------------- */
app.post('/execute',       runCode);
app.post('/submit-code',   runCode);


// const PORT = 8080;
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server listening on ${PORT}`)
);
