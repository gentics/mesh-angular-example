// This assumes that Mesh is running under localhost:8080
module.exports = {
  "/api/*": {
    target: "http://localhost:8080",
    secure: false,
    changeOrigin: true
  }
};
