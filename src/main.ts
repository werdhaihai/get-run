import * as core from '@actions/core';
import * as https from 'https';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { IncomingMessage } from 'http';

async function run(): Promise<void> {
  try {
    const url = core.getInput('url');
    const filePath = './script.sh';  

    // Download the file
    core.info(`Downloading script from: ${url}`);
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
    https.get(url, (response: IncomingMessage) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download file: HTTP ${response.statusCode}`));
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
