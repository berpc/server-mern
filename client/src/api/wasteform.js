import { ENV } from "../utils";

export class Wasteform {
  baseApi = ENV.BASE_API;

  async getWasteForm(accessToken, idWasteForm) {
    try {
      const url = `${this.baseApi}/waste/${idWasteForm}`;
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

  async createWasteForm(accessToken, data) {
    try {
      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}`;
      const url = `${this.baseApi}/add-waste`;
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

  async getWasteForms(accessToken, paramsWaste, active = undefined) {
    try {
      const pageFilter = `page=${paramsWaste?.page || 1}`;
      const limitFilter = `limit=${paramsWaste?.limit || 10}`;
      const siteFilter = `site=${paramsWaste?.site || undefined}`
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      let url=`${this.baseApi}/wastes?${pageFilter}&${limitFilter}`;
      if(active !== undefined){
        url = `${this.baseApi}/wastes?active=${active}&${pageFilter}&${limitFilter}`;
      }
      if(paramsWaste?.site){
        url = `${url}&${siteFilter}`
        console.log(url)
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

  async updateWasteForm(accessToken, idWasteForm, wasteFormData) {
    try {
      const data = wasteFormData;

      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });

      // const url = `${ENV.BASE_API}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${ENV.BASE_API}/update-waste/${idWasteForm}`;
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

  async deleteWasteForm(accessToken, idWasteForm) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${this.baseApi}/delete-waste/${idWasteForm}`;
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

  async existsWasteFormByPeriodAndYear(accessToken, siteId, period, year) {
    try {
      const url = `${this.baseApi}/waste-exists-site/${siteId}/${period}/${year}`;
      
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

  async getPeriodsWasteFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/wastes-periods-site-year/${siteId}/${year}`;
      
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
  
  async getWasteFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/wastes-site-year/${siteId}/${year}`;
      
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
    const url = `${this.baseApi}/upload-file-waste/`;

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
    const url = `${this.baseApi}/get-file-waste/${fileName}`;
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
    const url = `${this.baseApi}/delete-file-waste`;

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