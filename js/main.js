const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector("#navigation");
menuBtn.hidden = false;
document.documentElement.classList.add("menu-enabled");
menuBtn.addEventListener("click", () => {
  const open = menuBtn.getAttribute("aria-expanded") !== "true";
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close" : "Menu");
  menuBtn.classList.toggle("open", open);
  nav.classList.toggle("open", open);
});
function closeMenu() {
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Menu");
  menuBtn.classList.remove("open");
  nav.classList.remove("open");
}
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
function dismissMenuOutside(event) {
  if (
    menuBtn.getAttribute("aria-expanded") === "true" &&
    !event.target.closest("#navigation, .menu-toggle")
  ) closeMenu();
}
document.addEventListener("click", dismissMenuOutside);
document.addEventListener("focusin", dismissMenuOutside);
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuBtn.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuBtn.focus();
  }
});
if (typeof window.matchMedia === "function") {
  window.matchMedia("(min-width: 621px)").addEventListener?.("change", (event) => {
    if (event.matches) closeMenu();
  });
}
document.querySelector("#year").textContent = new Date().getFullYear();
if (
  "IntersectionObserver" in window &&
  typeof window.matchMedia === "function" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const io = new IntersectionObserver(
    (items) => {
      for (const item of items) {
        if (!item.isIntersecting) continue;
        item.target.classList.add("visible");
        io.unobserve(item.target);
      }
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((el) => io.observe(el));
  document.documentElement.classList.add("motion-ready");
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", (event) => {
    if (!event.matches) return;
    io.disconnect();
    document.documentElement.classList.remove("motion-ready");
  });
}
const form = document.querySelector("#contact-form");
form.querySelector('button[type="submit"]').disabled = false;
const statusText = document.querySelector("#form-status");
const draftArea = document.querySelector("#message-draft");
const draftNote = document.querySelector("#draft-label");
let draftVersion = 0;
function clearDraft() {
  draftVersion++;
  statusText.textContent = "";
  draftArea.value = "";
  draftArea.hidden = true;
  draftNote.hidden = true;
}
form.addEventListener("input", clearDraft);
form.addEventListener("reset", clearDraft);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearDraft();
  if (!form.reportValidity()) return;
  const version = draftVersion;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const body = form.elements.message.value.trim();
  if (!name || body.length < 10) {
    statusText.textContent =
      "Enter your name and a message of at least 10 characters.";
    (!name ? form.elements.name : form.elements.message).focus();
    return;
  }
  const text = `From: ${name}\nEmail: ${email}\n\n${body}`;
  draftArea.value = text;
  draftArea.hidden = false;
  draftNote.hidden = false;
  try {
    await navigator.clipboard.writeText(text);
    if (version !== draftVersion) return;
    statusText.textContent =
      "Draft copied. Nothing has been sent. Paste it into the channel you use to contact me.";
  } catch {
    if (version !== draftVersion) return;
    statusText.textContent =
      "Nothing has been sent. Select and copy your draft below.";
    draftArea.focus();
    draftArea.select();
  }
});
