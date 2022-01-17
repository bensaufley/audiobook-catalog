declare module 'mktemp' {
  export const createFileSync: (template: string) => string;
  export const createDirSync: (template: string) => string;
}
