const searchInput = document.querySelector("#appSearch");
const appCards = Array.from(document.querySelectorAll(".app-card"));
const filterButtons = Array.from(document.querySelectorAll(".segment"));
const emptyState = document.querySelector("#emptyState");
const todayLabel = document.querySelector("#todayLabel");

let activeFilter = "all";

function normalize(value) {
  return value.trim().toLowerCase();
}

function updateApps() {
  const query = normalize(searchInput.value);
  let visibleCount = 0;

  appCards.forEach((card) => {
    const matchesCategory =
      activeFilter === "all" || card.dataset.category === activeFilter;
    const haystack = normalize(`${card.dataset.name} ${card.textContent}`);
    const matchesQuery = haystack.includes(query);
    const isVisible = matchesCategory && matchesQuery;

    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  emptyState.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    updateApps();
  });
});

searchInput.addEventListener("input", updateApps);

const formatter = new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
});

todayLabel.textContent = formatter.format(new Date());
updateApps();
