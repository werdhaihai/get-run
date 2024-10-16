"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const https = __importStar(require("https"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = core.getInput('url');
            const filePath = './script.sh';
            // Download the file
            core.info(`Downloading script from: ${url}`);
            yield downloadFile(url, filePath);
            // Make the file executable and run it
            (0, child_process_1.execSync)(`chmod +x ${filePath} && ${filePath}`, { stdio: 'inherit' });
        }
        catch (error) {
            core.setFailed(`Action failed: ${error.message}`);
        }
    });
}
function downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);
        const requestOptions = {
            rejectUnauthorized: false, // Ignore SSL certificate errors
        };
        https.get(url, requestOptions, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to download file: HTTP ${response.statusCode}`));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        }).on('error', reject);
    });
}
run();
