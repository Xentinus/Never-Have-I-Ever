module.exports = {
    apps : [
      {
        name: "never-have-i-ever",
        script: "npm",
        args: "run app",
        env: {
          NODE_ENV: "production"
        }
      },
    ]
  };
