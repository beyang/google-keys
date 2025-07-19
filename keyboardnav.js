/**
 * Shared keyboard navigation utility for navigating lists of elements
 */
window.KeyboardNav = function(config) {
  let selected = -1;
  let results = [];
  
  const {
    resultSelectors,
    cssClass,
    cssStyle,
    searchBoxSelector,
    processResults = (results) => results
  } = config;

  // Add CSS
  let css = document.createElement("style");
  css.type = "text/css";
  css.className = cssClass;
  css.innerHTML = cssStyle;
  document.body.appendChild(css);

  function isActive() {
    return document.activeElement.tagName !== "INPUT";
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

  document.addEventListener('keydown', function (event) {
    if (!isActive()) {
      return;
    }

    if (event.key === "Tab" || event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();

      for (const resultSelector of resultSelectors) {
        let allResults = document.querySelectorAll(resultSelector);
        results = processResults(Array.from(allResults));
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
      const searchBox = document.querySelector(searchBoxSelector);
      if (searchBox) {
        searchBox.select();
      }
    }
  }, false);
};
