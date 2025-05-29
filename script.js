const STORAGE_KEY_TOP = "topButtonValues";
const STORAGE_KEY_BOTTOM = "bottomButtonValues";

function getSelectedDelta() {
  const selected = document.querySelector('input[name="delta"]:checked');
  return selected ? parseInt(selected.value, 10) : 0;
}

function setupButtonGroup(containerId, isTop) {
  const container = document.getElementById(containerId);
  const buttons = container.querySelectorAll("button");
  const savedValues = loadValues(isTop);

  buttons.forEach((btn, idx) => {
    const initValue = savedValues[idx] ?? 0;
    btn.dataset.value = initValue;
    updateButtonDisplay(btn, initValue, isTop);

    btn.addEventListener("click", () => {
      const delta = getSelectedDelta();
      if (delta === 0) return;

      let newValue = parseInt(btn.dataset.value) + delta;
      btn.dataset.value = newValue;
      updateButtonDisplay(btn, newValue, isTop);
      saveValues(isTop);
    });
  });
}

function updateButtonDisplay(btn, value, isTop) {
  if (isTop) {
    btn.innerHTML = `<span class="rotated-text">${value}</span>`;
  } else {
    btn.textContent = value;
  }
}

function saveValues(isTop) {
  const container = document.getElementById(
    isTop ? "top-buttons" : "bottom-buttons"
  );
  const buttons = container.querySelectorAll("button");
  const values = Array.from(buttons).map((btn) => parseInt(btn.dataset.value));
  const key = isTop ? STORAGE_KEY_TOP : STORAGE_KEY_BOTTOM;
  localStorage.setItem(key, JSON.stringify(values));
}

function loadValues(isTop) {
  const key = isTop ? STORAGE_KEY_TOP : STORAGE_KEY_BOTTOM;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function resetAllValues() {
  if (!confirm("本当に削除しますか？")) return;

  // リセット対象すべて
  ["top-buttons", "bottom-buttons"].forEach((id, idx) => {
    const isTop = id === "top-buttons";
    const container = document.getElementById(id);
    const buttons = container.querySelectorAll("button");

    buttons.forEach((btn) => {
      btn.dataset.value = 0;
      updateButtonDisplay(btn, 0, isTop);
    });

    localStorage.setItem(
      isTop ? STORAGE_KEY_TOP : STORAGE_KEY_BOTTOM,
      JSON.stringify([0, 0, 0, 0])
    );
  });
}

// 初期化
window.onload = function () {
  setupButtonGroup("top-buttons", true);
  setupButtonGroup("bottom-buttons", false);

  document
    .getElementById("reset-button")
    .addEventListener("click", resetAllValues);
};
