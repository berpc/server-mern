import { ENV } from "../utils";

export class Dangerousform {
  baseApi = ENV.BASE_API;

  async getDangerousForm(accessToken, idDangerousForm) {
    try {
      const url = `${this.baseApi}/dangerous/${idDangerousForm}`;
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

  async createDangerousForm(accessToken, data) {
    try {
      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}`;
      console.log(data)
      const url = `${this.baseApi}/add-dangerous`;
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

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getDangerousForms(accessToken, paramsDangerous, active = undefined) {
    try {
      const pageFilter = `page=${paramsDangerous?.page || 1}`;
      const limitFilter = `limit=${paramsDangerous?.limit || 10}`;
      const siteFilter = `site=${paramsDangerous?.site || undefined}`
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      let url=`${this.baseApi}/dangerous?${pageFilter}&${limitFilter}`;
      if(active !== undefined){
        url = `${this.baseApi}/dangerous?active=${active}&${pageFilter}&${limitFilter}`;
      }
      if(paramsDangerous?.site){
        url = `${url}&${siteFilter}`
      }
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

  async updateDangerousForm(accessToken, idDangerousForm, dangerousformData) {
    try {
      const data = dangerousformData;

      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });

      // const url = `${ENV.BASE_API}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${ENV.BASE_API}/update-dangerous/${idDangerousForm}`;
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

  async deleteDangerousForm(accessToken, idDangerousForm) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${this.baseApi}/delete-dangerous/${idDangerousForm}`;
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

  async existsDangerousFormByPeriodAndYear(accessToken, siteId, period, year) {
    try {
      const url = `${this.baseApi}/dangerous-exists-site/${siteId}/${period}/${year}`;
      
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

  async getPeriodsDangerousFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/dangerous-periods-site-year/${siteId}/${year}`;
      
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
  
  async getDangerousFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/dangerous-site-year/${siteId}/${year}`;
      
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

  async uploadFileApi(accessToken, data) {
    const url = `${this.baseApi}/upload-file-dangerous/`;

    const params = {
      method: "POST",
      body: data,
      headers: {
        //'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
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
        return err.message;
      });
  }

  async getFileApi(fileName) {
    const url = `${this.baseApi}/get-file-dangerous/${fileName}`;
    return fetch(url)
      .then((response) => {
        //console.log(response)
        return response.url;
      })
      .catch((err) => {
        return err.message;
      });
  }

  async deleteFileApi(accessToken, fileName) {
    const url = `${this.baseApi}/delete-file-dangerous`;

    const params = {
      method: "DELETE",
      body: JSON.stringify({ fileName }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    return fetch(url, params)
      .then((response) => {
        return response.url;
      })
      .catch((err) => {
        return err.message;
      });
  }
}