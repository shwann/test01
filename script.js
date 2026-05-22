const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const filterButtons = document.querySelectorAll(".app-tabs button");
const appCards = document.querySelectorAll(".app-card");
const searchForm = document.querySelector(".portal-search");
const searchInput = document.querySelector("#portal-search-input");

menuToggle?.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    appCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  appCards.forEach((card) => {
    const content = card.textContent.toLowerCase();
    card.hidden = Boolean(keyword) && !content.includes(keyword);
  });

  filterButtons.forEach((item) => item.classList.remove("active"));
  document.querySelector('[data-filter="all"]')?.classList.add("active");
});
