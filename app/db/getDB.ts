import path from "path";
import url from "url";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import fs from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

export const PROJECT_ROOT_FOLDER_PATH = path.join(__dirname, "..");

const {
  'sqlite_path': sqlitePath,
} = dbConfig as any;

export const getDB = async () => {
  const sqliteDB = await open({
    filename: sqlitePath,
    driver: sqlite3.Database,
  });
  return sqliteDB;
}
