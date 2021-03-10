(() => {
  let isCPressed; 
  let isSPressed;
  let isHPressed;
  let isFPressed;

  const init = () => {
    handleKeyboard();
    handleClick();
    handlePopup();
  };

  const handlePopup = () => {
    chrome.runtime.onMessage.addListener((command, sender, sendResponse) => {
      if (command === "copy_dataset") {
        const selector = prompt("Give the element selector (for example classes, id, ...)");
        const $dataset = document.querySelectorAll(selector);
        const dataset = [];
        let datasetStr = ``;
        $dataset.forEach((item, i) => {
          datasetStr += `${i + 1}. ${item.innerText}\n`;
          dataset.push(item.innerText);
        });
        
        const isDatasetGood = confirm(`Is this what you're looking for?: \n${datasetStr}`);
        
        if (isDatasetGood) {
          const whatToDo = prompt(`What you want to do with it? \n1 to copy to clipboard\n2 to inject it to another page`);

          if (whatToDo === "1") {
            copyToClipboard(datasetStr);
            alert("Copied to clipboard!");
          } else if (whatToDo === "2") {
            const urlToInject = prompt("Where to inject this dataset?");
            const inputSelector = prompt("Give the form input selector (optional)\nBacktick ` is forbidden!");
            // const closeAfterInjection = prompt("Close after injection? [yes] (default is no)");
            if (urlToInject !== "") {
              // sendResponse({ command: command, urlToInject: urlToInject, dataset: dataset });
              chrome.runtime.sendMessage({ 
                command: command, 
                urlToInject: urlToInject, 
                dataset: dataset, 
                inputSelector: inputSelector
                // closeAfterInjection: closeAfterInjection
              });
            }

          }
        }

      } else if (command === "copy_imageorvideo") {
        isCPressed = true;
        window.close();
      }
    });
  };

  const handleClick = () => {
    document.addEventListener('click', ({ target }) => {
      isCPressed && copyImageOrVideo(target);
    }); 
  };

  const handleKeyboard = () => {
    //Pressing down the keyboard
    document.addEventListener('keydown', ({ key }) => { 
      isCPressed = key === "c";
      isSPressed = key === "P";
      isHPressed = key === "h";
      isFPressed = key === "f";
    });
    
    //Releasing the key
    document.addEventListener('keyup', () => {
      isCPressed = isSPressed = isHPressed = isFPressed = false;
    }); 
  };

  const copyImageOrVideo = target => {
    if (!isCPressed) return; 
    const media = getImageOrVideo(target);
    window.open(media.src, "_blank"); 
    isCPressed = false;
  };

  const getImageOrVideo = el => {
    if (containsImgOrVideo(el)) return containsImgOrVideo(el);
    return getImageOrVideo(el.parentNode);
  };

  const containsImgOrVideo = el => el.querySelector('img') || el.querySelector('video');

  const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  init();
})();