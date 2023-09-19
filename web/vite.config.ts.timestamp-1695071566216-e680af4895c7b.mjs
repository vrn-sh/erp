// vite.config.ts
import { defineConfig, loadEnv } from "file:///mnt/d/School/EIP/lastest/erp/web/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/d/School/EIP/lastest/erp/web/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig(() => {
  const env = loadEnv("mock", process.cwd(), "");
  const processEnvValues = {
    "process.env": Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val
      };
    }, {})
  };
  return {
    plugins: [react()],
    define: processEnvValues
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2QvU2Nob29sL0VJUC9sYXN0ZXN0L2VycC93ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9tbnQvZC9TY2hvb2wvRUlQL2xhc3Rlc3QvZXJwL3dlYi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L2QvU2Nob29sL0VJUC9sYXN0ZXN0L2VycC93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XG4gICAgY29uc3QgZW52ID0gbG9hZEVudignbW9jaycsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgICBjb25zdCBwcm9jZXNzRW52VmFsdWVzID0ge1xuICAgICAgICAncHJvY2Vzcy5lbnYnOiBPYmplY3QuZW50cmllcyhlbnYpLnJlZHVjZSgocHJldiwgW2tleSwgdmFsXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAuLi5wcmV2LFxuICAgICAgICAgICAgICAgIFtrZXldOiB2YWwsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCB7fSksXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgICAgICAgZGVmaW5lOiBwcm9jZXNzRW52VmFsdWVzLFxuICAgIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVIsU0FBUyxjQUFjLGVBQWU7QUFDM1QsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYSxNQUFNO0FBQzlCLFFBQU0sTUFBTSxRQUFRLFFBQVEsUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUM3QyxRQUFNLG1CQUFtQjtBQUFBLElBQ3JCLGVBQWUsT0FBTyxRQUFRLEdBQUcsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNO0FBQzVELGFBQU87QUFBQSxRQUNILEdBQUc7QUFBQSxRQUNILENBQUMsR0FBRyxHQUFHO0FBQUEsTUFDWDtBQUFBLElBQ0osR0FBRyxDQUFDLENBQUM7QUFBQSxFQUNUO0FBRUEsU0FBTztBQUFBLElBQ0gsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFFBQVE7QUFBQSxFQUNaO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
