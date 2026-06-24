// laboratory/scenarios/processor.js

module.exports = {
  // Add custom functions here if needed by scenarios
  generateRandomData: function(userContext, events, done) {
    userContext.vars.randomName = 'Product_' + Math.random().toString(36).substring(7);
    return done();
  }
};
