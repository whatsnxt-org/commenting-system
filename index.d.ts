// index.d.ts
export function setupCommentingSystem(options: SetupOptions): void;

export interface SetupOptions {
  elementId: string;
  apiKey: string;
  theme?: string;
}