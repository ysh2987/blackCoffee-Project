// [O] 에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
// [O] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// [O] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// [O] 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
// [O] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.
// [O] 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
// [ ] 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
// [ ] 총 메뉴 갯수를 count하여 상단에 보여준다.
// [ ] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.

// 에스프레소, 프라푸치노, 블렌디드, 티바나, 디저트 각각의 종류별로 메뉴판을 관리할 수 있게 만든다.
// 페이지에 최초로 접근할 때는 에스프레소 메뉴가 먼저 보이게 한다.
// 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// 품절 상태 메뉴의 마크업

// fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
// API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// 중복되는 메뉴는 추가할 수 없다.

function App() {
  const $ = (selector) => document.querySelector(`${selector}`);
  const BASE_URL = "http://localhost:3000";
  let now = "espresso";

  const store = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  const duplication = (menu, newMenuItem) =>
    menu.find((menuItem) => menuItem.name === newMenuItem);

  const MenuCategoryList = async (category) => {
    const res = await fetch(`${BASE_URL}/api/category/${category}/menu`);
    const name = await res.json();
    return await name;
  };

  const createMenu = (menuName, category) => {
    fetch(`${BASE_URL}/api/category/${category}/menu/`, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ name: menuName }),
    });
  };

  const modifyMenu = (newMenu, menuName, category) => {
    fetch(`${BASE_URL}/api/category/${category}/menu/${menuName}`, {
      method: "PUT",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ name: newMenu }),
    });
  };

  const deleteMenu = (category, menuId) => {
    fetch(`${BASE_URL}/api/category/${category}/menu/${menuId}`, {
      method: "DELETE",
    });
  };

  const soldoutMenu = (menuId, category) => {
    const res = fetch(
      `${BASE_URL}/api/category/${category}/menu/${menuId}/soldout`,
      {
        method: "PUT",
      }
    );
  };
  const render = async () => {
    const rep = await MenuCategoryList(now);
    const test = [...rep]
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
    $("#menu-list").innerHTML = test;
    $(".menu-count").innerText = `총 ${rep.length}개`;
  };

  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  // 확인 버튼 클릭
  $("#menu-submit-button").addEventListener("click", async () => {
    const getData = await MenuCategoryList(now);
    if (duplication(getData, $("#menu-name").value)) {
      alert("이름이 중복되용");
      $("#menu-name").value = "";
      return;
    }

    createMenu($("#menu-name").value, now);
    render();
    $("#menu-name").value = "";
  });

  $("#menu-name").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      createMenu($("#menu-name").value, now);
      render();
      $("#menu-name").value = "";
    }
  });

  $("#menu-list").addEventListener("click", async (e) => {
    if (e.target.matches(".menu-edit-button")) {
      modifyMenu(
        prompt(
          "수정할 메뉴 이름을 입력하세요",
          `${
            e.target.closest(".menu-list-item").querySelector(".menu-name")
              .textContent
          }`
        ),
        e.target.closest(".menu-list-item").dataset.menuId,
        now
      );
      render();
    }
    if (e.target.matches(".menu-remove-button")) {
      if (confirm("삭제하시겠습니까")) {
        deleteMenu(now, e.target.closest(".menu-list-item").dataset.menuId);
        render();
      }
    }

    if (e.target.matches(".menu-sold-out-button")) {
      await soldoutMenu(e.target.closest("li").dataset.menuId, now);
      render();
    }
  });

  $(".category").addEventListener("click", (e) => {
    if (!e.target.matches(".cafe-category-name")) return;
    now = e.target.dataset.categoryName;
    render();
    $(".menu-title").textContent = `${e.target.textContent} 메뉴 관리`;
  });
  render();
}

App();
