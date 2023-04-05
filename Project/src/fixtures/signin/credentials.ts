import fs from 'fs';
import path from 'path';

interface Credentials {
    username: string;
    password: string;
}

export function readCredentials(): Credentials {
    const filePath = path.resolve(__dirname, 'secrets.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const credentials: Credentials = JSON.parse(rawData);
    return credentials;
}