import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import express from 'express';
type MongoConnection = mongoose.Connection | MongoClient;
export declare const setupCommentingSystem: (app: express.Application, mongoConnection: MongoConnection) => void;
export {};
