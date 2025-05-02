// This script runs the Prisma seed script with the necessary environment variables
const { execSync } = require('child_process');
const path = require('path');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for Cloudinary cloud name
rl.question('Enter your Cloudinary cloud name (or press Enter to skip Cloudinary upload): ', (cloudName) => {
  // Update the seed.ts file with the cloud name if provided
  if (cloudName) {
    try {
      let seedContent = fs.readFileSync(path.join(__dirname, 'prisma', 'seed.ts'), 'utf8');
      seedContent = seedContent.replace(
        /const CLOUDINARY_URL = 'https:\/\/api\.cloudinary\.com\/v1_1\/.*\/image\/upload';/,
        `const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/${cloudName}/image/upload';`
      );
      
      // Uncomment Cloudinary upload code
      seedContent = seedContent.replace(
        '// const imageSrc = await uploadImageToCloudinary(imagePath);',
        'const imageSrc = await uploadImageToCloudinary(imagePath);'
      );
      seedContent = seedContent.replace(
        '// console.log(`Uploaded image to Cloudinary: ${imageSrc}`);',
        'console.log(`Uploaded image to Cloudinary: ${imageSrc}`);'
      );
      seedContent = seedContent.replace(
        'const imageSrc = `/listings/${imageFile}`;',
        '// const imageSrc = `/listings/${imageFile}`;'
      );
      
      fs.writeFileSync(path.join(__dirname, 'prisma', 'seed.ts'), seedContent);
      console.log('Updated seed.ts with Cloudinary cloud name');
    } catch (error) {
      console.error('Error updating seed.ts:', error);
    }
  }

  console.log('Running Prisma seed script...');
  
  try {
    // Direct ts-node execution instead of using npm run
    execSync('node_modules\\.bin\\ts-node -P prisma/tsconfig.seed.json prisma/seed.ts', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL // Make sure your DATABASE_URL is set in the environment
      } 
    });
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error running seed:', error);
  }
  
  rl.close();
}); 