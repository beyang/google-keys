(function() {
  /**
   * State
   */
  let selected = -1;
  let results = [];
  const resultSelectors = [
    "div.yuRUbf a[href] h3"
  ];

  /**
   * CSS
   */
  let css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = '.quick-selected::before { content: "▶"; position: absolute; left: -1em; font-size: 0.75em; top: 0.125em; }';
  document.body.appendChild(css);

  function isActive() {
    return document.activeElement.tagName !== "INPUT";
  }

  /**
   * Sync view to state
   */
  function refresh() {
    for (let i = 0; i < results.length; i++) {
      if (i === selected) {
        results[i].classList.add("quick-selected");
        if (!isInViewport(results[i])) {
          results[i].scrollIntoView(true);
        }
      } else {
        results[i].classList.remove("quick-selected");
      }
    }
  }

  function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    var html = document.documentElement;
    return (
      rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || html.clientHeight) &&
        rect.right <= (window.innerWidth || html.clientWidth)
    );
  }

  document.addEventListener('keydown', function (event) {
    if (!isActive()) {
      return;
    }

    if (event.key === "Tab" || event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();

      for (const resultSelector of resultSelectors) {
        results = document.querySelectorAll(resultSelector);
        if (results.length > 0) {
          break;
        }
      }
      if (results.length === 0) {
        return;
      }
      if ((event.key === "Tab" && event.shiftKey) || event.key === "ArrowUp") {
        selected = (selected - 1 + results.length) % results.length;
      } else if ((event.key === "Tab" && !event.shiftKey) || event.key === "ArrowDown") {
        selected = (selected + 1 + results.length) % results.length;
      }
      refresh();
    } else if (event.key === "Enter") {
      if (results.length === 0) {
        return;
      }
      for (let e = results[selected]; e; e = e.parentElement) {
        if (e.href) {
          window.location.href = e.href;
          break;
        }
      }
    } else if (event.key === "Escape") {
      document.querySelector("input.gsfi").select();
    }
  }, false);
})();
