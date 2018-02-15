/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '*.svg' {
  const contents: string;
  export default contents;
}
