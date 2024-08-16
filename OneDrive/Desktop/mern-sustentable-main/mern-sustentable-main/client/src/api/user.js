import { ENV } from "../utils";

export class User {
  baseApi = ENV.BASE_API;

  async getMe(accessToken) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.USER_ME}`;
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

  async createUser(accessToken, data) {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (data.fileAvatar) {
        formData.append("avatar", data.fileAvatar);
      }

      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}`;
      const url = `${this.baseApi}/add-user`;
      const params = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(accessToken, active = undefined) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      const url = `${this.baseApi}/users?active=${active}`;
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

  async updateUser(accessToken, idUser, userData) {
    try {
      const data = userData;
      if (!data.password) {
        delete data.password;
      }

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (data.fileAvatar) {
        formData.append("avatar", data.fileAvatar);
      }

      // const url = `${ENV.BASE_API}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${ENV.BASE_API}/update-user/${idUser}`;
      const params = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(accessToken, idUser) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${this.baseApi}/delete-user/${idUser}`;
      const params = {
        method: "DELETE",
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

  async verifyEmailApi(data) {
    const url = `${this.baseApi}/verify-email`;
    const params = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    //console.log(data);

    return fetch(url, params)
      .then((response) => {
        //console.log("api response");
        //console.log(response);
        return response.json();
      })
      .then((result) => {
        //console.log("api result");
        //console.log(result);
        if (result.message === "e-mail encontrado") {
          return {
            ok: true,
            message: "¡e-mail encontrado!",
          };
        }
        return {
          ok: false,
          message: result.message,
        };
      })
      .catch((err) => {
        return {
          ok: false,
          message: err.message,
        };
      });
  }

  async sendEmail(data) {
    const url = `${this.baseApi}/send-email`;
    const params = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return fetch(url, params)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.message === "email de recuperación enviado") {
          return {
            ok: true,
            message: result.message,
          };
        }
        return {
          ok: false,
          message: result.message,
        };
      })
      .catch((err) => {
        return {
          ok: false,
          message: err.message,
        };
      });
  }

  async updatePasswordByTokenApi(user, resetToken) {
    const url = `${this.baseApi}/update-password-by-token/${resetToken}`;
    const params = {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    };

    return fetch(url, params)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }
}
