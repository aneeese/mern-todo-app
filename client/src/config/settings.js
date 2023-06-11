const config = {
  apiUrl:
    import.meta.env.VITE_API_URL ||
    "https://mern-todo-app-production-3286.up.railway.app" ||
    "http://localhost:5000" ||
    "http://localhost:4000"
};

export default config;
