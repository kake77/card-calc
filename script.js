const STORAGE_KEY_LEFT = "leftValues";
const STORAGE_KEY_RIGHT = "rightValues";

function getSelectedDelta() {
  const selected = document.querySelector('input[name="delta"]:checked');
  return selected ? parseInt(selected.value, 10) : 0;
}

function setupSide(fieldId, storageKey) {
  const container = document.getElementById(fieldId);
  const buttons = container.querySelectorAll("button");
  const saved = loadValues(storageKey);

  buttons.forEach((btn, i) => {
    let val = saved[i] ?? 0;
    btn.dataset.value = val;
    btn.textContent = val;

    btn.addEventListener("click", () => {
      const delta = getSelectedDelta();
      if (!delta) return;

      val += delta;
      btn.dataset.value = val;
      btn.textContent = val;
      saveValues(storageKey, buttons);
    });
  });
}

function saveValues(key, buttons) {
  const values = Array.from(buttons).map((b) => parseInt(b.dataset.value));
  localStorage.setItem(key, JSON.stringify(values));
}

function loadValues(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function resetAll() {
  if (!confirm("本当に削除しますか？")) return;

  ["left", "right"].forEach((side) => {
    const key = side === "left" ? STORAGE_KEY_LEFT : STORAGE_KEY_RIGHT;
    const container = document.getElementById(`${side}-fields`);
    const buttons = container.querySelectorAll("button");

    buttons.forEach((btn) => {
      btn.dataset.value = 0;
      btn.textContent = "0";
    });

    saveValues(key, buttons);
  });
}

window.onload = () => {
  setupSide("left-fields", STORAGE_KEY_LEFT);
  setupSide("right-fields", STORAGE_KEY_RIGHT);

  document.getElementById("reset-button").addEventListener("click", resetAll);
};
