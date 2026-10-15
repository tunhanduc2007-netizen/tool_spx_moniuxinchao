document.getElementById("openAppBtn").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://moniuxinchaospx.netlify.app" });
});
