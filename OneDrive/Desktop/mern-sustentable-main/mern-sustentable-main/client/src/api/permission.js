import { ENV } from "../utils";

export class Permission {
  baseApi = ENV.BASE_API;

  async getPermission(accessToken, idPermission) {
    try {
      const url = `${this.baseApi}/permission/${idPermission}`;
      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createPermission(accessToken, data) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}`;
      const url = `${this.baseApi}/add-permission`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPermissions(accessToken, active = undefined) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      const url = `${this.baseApi}/permissions?active=${active}`;
      const params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPermissionsByRole(accessToken, roleId, active = undefined) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      const url = `${this.baseApi}/permissions-role/${roleId}?active=${active}`;
      const params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPermissionsByRoleAndModule(accessToken, roleId, module) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      const url = `${this.baseApi}/permissions-role-module/${roleId}?module=${module}`;
      const params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPermissionsByRoleId(accessToken, roleId) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      const url = `${this.baseApi}/permissions-role/${roleId}`;
      const params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updatePermission(accessToken, idPermission, permissionData) {
    try {
      const data = permissionData;
      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });

      // const url = `${ENV.BASE_API}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${ENV.BASE_API}/update-permission/${idPermission}`;
      const params = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deletePermission(accessToken, idPermission) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${this.baseApi}/delete-permission/${idPermission}`;
      const params = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }
}