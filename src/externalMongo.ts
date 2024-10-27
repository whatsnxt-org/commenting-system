import { MongoClient } from 'mongodb';
import express from 'express';
import { setupCommentingSystemRoutes } from './middlewares/middleware';
import mongoose from 'mongoose';
import { INestApplication } from '@nestjs/common';

// Variable to store the MongoClient instance
let mongoClient: MongoClient | null = null;
type MongoConnection = mongoose.Connection | MongoClient;
type AppType = express.Application | INestApplication;

function isMongoClient(connection: any): connection is MongoClient {
    return connection instanceof MongoClient;
}

// Function to start the external server with an existing Mongo connection
export async function createExternalServer(app: AppType) {

    try {
        // Assume you get the existing connection from somewhere
        const mongoConnection = await getExistingMongoConnection();
        await mongoConnection.connect();

        // Use the existing MongoDB connection for the commenting system
        setupCommentingSystemRoutes(app);

    } catch (error) {
        console.error('Failed to start the server:', error);
    }
}


// Function to get or create a MongoClient connection
async function getExistingMongoConnection(): Promise<MongoClient> {
    // If the client is already created, return it
    if (mongoClient && isMongoClient(mongoClient)) {
        return mongoClient;
    }

    // Create a new client if one does not exist
    mongoClient = new MongoClient(process.env.MONGO_URI as string);

    // Connect the client before returning it
    await mongoClient.connect();
    console.log('MongoClient connected to the database.');

    return mongoClient;
}
