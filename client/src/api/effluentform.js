import { ENV } from "../utils";

export class Effluentform {
  baseApi = ENV.BASE_API;

  async getEffluentForm(accessToken, idEffluentForm) {
    try {
      const url = `${this.baseApi}/effluent/${idEffluentForm}`;
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

  async createEffluentForm(accessToken, data) {
    try {
      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}`;
      const url = `${this.baseApi}/add-effluent`;
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

  async getEffluentForms(accessToken, paramsEffluent, active = undefined) {
    try {
      const pageFilter = `page=${paramsEffluent?.page || 1}`;
      const limitFilter = `limit=${paramsEffluent?.limit || 10}`;
      const siteFilter = `site=${paramsEffluent?.site || undefined}`
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      let url=`${this.baseApi}/effluents?${pageFilter}&${limitFilter}`;
      if(active !== undefined){
        url = `${this.baseApi}/effluents?active=${active}&${pageFilter}&${limitFilter}`;
      }
      if(paramsEffluent?.site){
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

  async updateEffluentForm(accessToken, idEffluentForm, effluentFormData) {
    try {
      const data = effluentFormData;

      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });

      // const url = `${ENV.BASE_API}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${ENV.BASE_API}/update-effluent/${idEffluentForm}`;
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

  async deleteEffluentForm(accessToken, idEffluentForm) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${this.baseApi}/delete-effluent/${idEffluentForm}`;
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

  async existsEffluentFormByPeriodAndYear(accessToken, siteId, period, year) {
    try {
      const url = `${this.baseApi}/effluent-exists-site/${siteId}/${period}/${year}`;
      
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

  async getPeriodsEffluentFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/effluents-periods-site-year/${siteId}/${year}`;
      
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
  
  async getEffluentFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/effluents-site-year/${siteId}/${year}`;
      
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
    const url = `${this.baseApi}/upload-file-effluent/`;

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
    const url = `${this.baseApi}/get-file-effluent/${fileName}`;
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
    const url = `${this.baseApi}/delete-file-effluent`;

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

