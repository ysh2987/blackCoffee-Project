import { $ } from "./utils/selector.js";
import { render } from "./utils/render.js";
import { store } from "./store/cafeMenu.js";
import MenuApi from "./api/menuRequest.js";

function App() {
  let currentCategory = "espresso";

  const init = () => render(currentCategory);

  const menuNameValidation = (menu, newMenuName) => {
    const duplicationCheck = menu.find(
      (menuItem) => menuItem.name === newMenuName
    );
    if (newMenuName.length === 1) {
      alert("메뉴 이름은 최소 2글자 입니다.");
      $("#menu-name").value = "";
      return true;
    }
    if (newMenuName.trim() === "") {
      alert("메뉴 이름을 입력해 주세요");
      $("#menu-name").value = "";
      return true;
    }

    if (duplicationCheck) {
      alert("메뉴 이름이 중복됩니다.");
      $("#menu-name").value = "";
      return true;
    }
  };

  const createMenu = async () => {
    if (menuNameValidation(store[currentCategory], $("#menu-name").value))
      return;
    await MenuApi.createMenuName(currentCategory, $("#menu-name").value);
    $("#menu-name").value = "";
    render(currentCategory);
  };

  const removeMenu = async (e) => {
    if (!confirm("삭제 하시겠습니까?")) return;
    const deleteMenuName = e.target.closest(".menu-list-item").dataset.menuId;
    await MenuApi.removeMenuName(currentCategory, deleteMenuName);
    render(currentCategory);
  };

  const updateMenu = async (e) => {
    const oldMneuName = e.target
      .closest(".menu-list-item")
      .querySelector(".menu-name").textContent;
    const newMenuName = prompt(
      "수정할 메뉴 이름을 입력하세요",
      `${oldMneuName}`
    );
    if (!newMenuName) return;
    if (menuNameValidation(store[currentCategory], newMenuName)) return;
    await MenuApi.updateMenuName(
      currentCategory,
      newMenuName,
      e.target.closest(".menu-list-item").dataset.menuId
    );
    render(currentCategory);
  };

  const updateMenuSoldOut = async (e) => {
    await MenuApi.toggleSoldout(
      currentCategory,
      e.target.closest("li").dataset.menuId
    );
    render(currentCategory);
  };

  const changeCategory = (e) => {
    currentCategory = e.target.dataset.categoryName;
    $(".menu-title").textContent = `${e.target.textContent} 메뉴관리`;
    render(currentCategory);
  };

  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#menu-submit-button").addEventListener("click", createMenu);

  $("#menu-name").addEventListener("keyup", (e) => {
    if (e.key === "Enter") createMenu();
  });

  $("#menu-list").addEventListener("click", (e) => {
    if (e.target.matches(".menu-edit-button")) updateMenu(e);
    if (e.target.matches(".menu-remove-button")) removeMenu(e);
    if (e.target.matches(".menu-sold-out-button")) updateMenuSoldOut(e);
  });

  $(".category").addEventListener("click", (e) => {
    if (e.target.matches(".cafe-category-name")) changeCategory(e);
  });

  init();
}
App();
