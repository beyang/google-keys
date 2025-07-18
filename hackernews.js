(function() {
  /**
   * State
   */
  let selected = -1;
  let results = [];
  const resultSelectors = [
    "tr.athing td.title span.titleline a[href]:not([href^='from?site=']), tr td.subtext a[href^='item?id=']"
  ];

  /**
   * CSS
   */
  let css = document.createElement("style");
  css.type = "text/css";
  css.className = "hackernews-keys";
  css.innerHTML = '.quick-selected { background-color: rgba(255, 102, 0, 0.1) !important; border-radius: 2px !important; }';
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
        let allResults = document.querySelectorAll(resultSelector);
        // Filter to only include main article links and comments links (not "hours ago" links)
        results = Array.from(allResults).filter(link => 
          !link.href.includes('item?id=') || link.textContent.includes('comment')
        );
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
      const searchBox = document.querySelector("input[name='q']");
      if (searchBox) {
        searchBox.select();
      }
    }
  }, false);
})();
