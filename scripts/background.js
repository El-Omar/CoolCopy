chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { dataset, urlToInject, inputSelector } = request;
  const selector = JSON.stringify(inputSelector !== "" ? `${inputSelector}` : `input[type="text"]`);
  let counter = 0;

  const createAndInjectTab = data => {
    chrome.tabs.create({ url: urlToInject }, tab => {
      counter ++;
      chrome.tabs.executeScript(tab.id, {
        code: `
        window.addEventListener('load', () => {
          const $input = document.querySelector(` + selector + `);
          if ($input) {
            $input.value = "${data}";
            $input.form.submit();
          }
        });
        `
      }, () => {
        dataset[counter] && createAndInjectTab(dataset[counter]);
      });
    });
  };

  dataset.length > 0 && createAndInjectTab(dataset[0]);
});