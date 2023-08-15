const { defineConfig } = require("cypress");
const { faker } = require("@faker-js/faker");

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
