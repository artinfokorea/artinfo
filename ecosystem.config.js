module.exports = {
  apps: [
    {
      name: "artinfo-frontend@main",
      exec_mode: "cluster",
      instances: "2",
      script: "yarn",
      args: "start",
    },
  ],
}
