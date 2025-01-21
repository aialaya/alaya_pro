interface Window {
  httpSign?: (url: string, query: string, method: string, body: string) => string;
} 