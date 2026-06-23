// Ambient declarations so static asset requires type-check cleanly
// under the project's restricted `types` compiler option.
declare var require: (moduleName: string) => any;

declare module '*.png' {
  const value: number;
  export default value;
}
