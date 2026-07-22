declare global {
  namespace NodeJS {
    type Timeout = ReturnType<typeof setTimeout>;
  }
}

export {};
