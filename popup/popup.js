const init = () => {
  const $btns = document.querySelectorAll(`.command-btn`);
  $btns.forEach(btn => btn.addEventListener("click", onBtnClicked));
};

const onBtnClicked = ({ target }) => {
  const id = target.getAttribute("id");

  if (id && id !== ``) {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, id);
    });
  }
};

init();