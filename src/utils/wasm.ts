export const InitWasm = async (): Promise<void> => {
    const go = new Go();
    const response = await fetch('/main.wasm');
    const buffer = await response.arrayBuffer();
    const module = await WebAssembly.instantiate(buffer, go.importObject);
    go.run(module.instance);
  };
  
  export const httpSign = (url: string, query: string, method: string, body: string) => {
    let result = '';
    try {
      result = window?.httpSign?.(url, query, method, body) ?? '';
    } catch (e) {
      console.log(e);
    }
    return result;
  };
  