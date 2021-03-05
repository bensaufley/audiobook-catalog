import { resolve } from 'path';

process.env.IMPORTS_PATH = '/imports';
process.env.NODE_ENV = 'test';
process.env.ROOT_DIR ||= resolve(__dirname, '../..');
process.env.STORAGE_PATH = '/storage';
