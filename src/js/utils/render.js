import { $ } from "./selector.js";
import { store } from "../store/cafeMenu.js";
import MenuApi from "../api/menuRequest.js";

export const render = async (currentCategory) => {
  store[currentCategory] = await MenuApi.categoryMenuList(currentCategory);
  const listItem = store[currentCategory]
    .map((item) => {
      return `<li data-menu-id = ${
        item.id
      } class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name ${item.isSoldOut ? "sold-out" : ""}">${
        item.name
      }</span>
    <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
    >
    
      수정
    </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
    >
      삭제
    </button>
  </li>`;
    })
    .join("");
  $("#menu-list").innerHTML = listItem;
  $(".menu-count").innerText = `총 ${store[currentCategory].length}개`;
};
