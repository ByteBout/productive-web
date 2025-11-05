const api = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener((msg) => {
  if (msg.disableXFeed) {
    api.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["x_ruleset"],
    });
  } else {
    api.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ["x_ruleset"],
    });
  }
});
