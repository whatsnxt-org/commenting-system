import { Application as ExpressApplication } from 'express';
import { INestApplication } from '@nestjs/common';
type CompatibleApp = ExpressApplication | INestApplication;
export declare const setupCommentingSystem: (app: CompatibleApp) => void;
export {};
