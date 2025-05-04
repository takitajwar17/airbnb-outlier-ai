// This script runs the Prisma seed script with the necessary environment variables
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to run the seeding process
async function runSeedProcess(iterationCount = 1, currentIteration = 1) {
  return new Promise((resolve) => {
    console.log(`\n[Iteration ${currentIteration}/${iterationCount}] Starting seed process...`);
    
    try {
      // Generate random number of users between 5 and 50
      const userCount = getRandomInt(5, 50);
      
      // Update the NUM_USERS constant in seed.ts
      let seedContent = fs.readFileSync(path.join(__dirname, 'prisma', 'seed.ts'), 'utf8');
      seedContent = seedContent.replace(
        /const NUM_USERS = \d+;/,
        `const NUM_USERS = ${userCount};`
      );
      fs.writeFileSync(path.join(__dirname, 'prisma', 'seed.ts'), seedContent);
      console.log(`[Iteration ${currentIteration}/${iterationCount}] Set to generate ${userCount} users`);
      
      console.log(`[Iteration ${currentIteration}/${iterationCount}] Running Prisma seed script...`);
      console.log('This will generate completely random data...');
      
      // Direct ts-node execution
      execSync('node_modules\\.bin\\ts-node -P prisma/tsconfig.seed.json prisma/seed.ts', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL
        } 
      });
      
      console.log(`[Iteration ${currentIteration}/${iterationCount}] Seed completed successfully!`);
      
      // If we have more iterations to run, proceed to the next one
      if (currentIteration < iterationCount) {
        // Add a small delay between iterations to prevent potential race conditions
        setTimeout(() => {
          resolve(runSeedProcess(iterationCount, currentIteration + 1));
        }, 1000);
      } else {
        console.log(`\nAll ${iterationCount} iterations completed successfully!`);
        resolve();
      }
    } catch (error) {
      console.error('Error during seed process:', error);
      resolve();
    }
  });
}

// Get iteration count from command line argument or use default
const args = process.argv.slice(2);
const iterationCount = parseInt(args[0]) || 1;

if (iterationCount < 1) {
  console.log('Invalid number of iterations. Using default of 1.');
  runSeedProcess(1);
} else {
  console.log(`Starting seeding process for ${iterationCount} iterations...`);
  runSeedProcess(iterationCount);
} 