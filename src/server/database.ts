import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'INFT2202';

class Database {
    private static instance: Database;
    private client: MongoClient;
    private db: Db | null = null;

    private constructor() {
        this.client = new MongoClient(uri);
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<Db> {
        if (!this.db) {
            await this.client.connect();
            this.db = this.client.db(dbName);
            console.log('Connected to MongoDB');
        }
        return this.db;
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
        this.db = null;
        console.log('Disconnected from MongoDB');
    }
}

export default Database.getInstance();