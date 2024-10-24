import express from 'express';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
type MongoConnection = mongoose.Connection | MongoClient;
export declare const setupCommentingSystem: (app: express.Application, mongoConnection: MongoConnection) => void;
export {};
