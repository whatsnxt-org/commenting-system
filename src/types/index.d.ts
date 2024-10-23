export interface SetupOptions {
  elementId: string;
  apiKey: string;
  theme?: string;
}

// index.d.ts
declare module 'commenting-system' {
  export function setupCommentingSystem(app: any): void;
  export const commentRoutes: any;
  export const commentGraphQLSchema: any;
}
