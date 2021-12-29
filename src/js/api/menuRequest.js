const BASE_URL = "http://localhost:3000";

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const request = async (url, option) => {
  try {
    const response = await fetch(url, option);
    return response.json();
  } catch (e) {
    console.error(e);
  }
};

const requestWithoutJSON = async (url, option) => {
  try {
    const response = await fetch(url, option);
    return response;
  } catch (e) {
    console.error(e);
  }
};

const MenuApi = {
  async categoryMenuList(category) {
    return request(`${BASE_URL}/api/category/${category}/menu`);
  },
  async createMenuName(category, name) {
    return request(
      `${BASE_URL}/api/category/${category}/menu`,
      HTTP_METHOD.POST({ name })
    );
  },
  async updateMenuName(category, name, menuId) {
    return request(
      `${BASE_URL}/api/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT({ name })
    );
  },
  async toggleSoldout(category, menuId) {
    return request(
      `${BASE_URL}/api/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.PUT()
    );
  },
  async removeMenuName(category, menuId) {
    return requestWithoutJSON(
      `${BASE_URL}/api/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE()
    );
  },
};

export default MenuApi;
