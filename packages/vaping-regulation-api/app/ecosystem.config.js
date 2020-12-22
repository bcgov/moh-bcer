module.exports = {
  apps: [{
    name: "vape-api",
    script: "./dist/main.js",
    env: {
      NODE_ENV: "production",
    },
  }]
}
