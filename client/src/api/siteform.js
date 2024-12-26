import { ENV } from "../utils";

export class Siteform {
  baseApi = ENV.BASE_API;

  async getSiteForm(accessToken, idSiteForm) {
    try {
      const url = `${this.baseApi}/siteform/${idSiteForm}`;
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

  async createSiteForm(accessToken, data) {
    try {
      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}`;
      const url = `${this.baseApi}/add-siteform`;
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

  async getSiteForms(accessToken, paramsSite, active = undefined) {
    try {
      const pageFilter = `page=${paramsSite?.page || 1}`;
      const limitFilter = `limit=${paramsSite?.limit || 10}`;
      const siteFilter = `site=${paramsSite?.site || undefined}`
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      let url=`${this.baseApi}/siteforms?${pageFilter}&${limitFilter}`;
      if(active !== undefined){
        url = `${this.baseApi}/siteforms?active=${active}&${pageFilter}&${limitFilter}`;
      }
      if(paramsSite?.site){
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

  async updateSiteForm(accessToken, idSiteForm, siteformData) {
    try {
      const data = siteformData;

      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });

      // const url = `${ENV.BASE_API}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${ENV.BASE_API}/update-siteform/${idSiteForm}`;
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

  async deleteSiteForm(accessToken, idSiteForm) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${this.baseApi}/delete-siteform/${idSiteForm}`;
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

  async existsSiteFormByPeriodAndYear(accessToken, siteId, period, year) {
    try {
      const url = `${this.baseApi}/siteform-exists-site/${siteId}/${period}/${year}`;
      
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

  async getPeriodsSiteFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/siteforms-periods-site-year/${siteId}/${year}`;
      
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
  
  async getSiteFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/siteforms-site-year/${siteId}/${year}`;
      
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
    const url = `${this.baseApi}/upload-file-siteform/`;

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
    const url = `${this.baseApi}/get-file-siteform/${fileName}`;
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
    const url = `${this.baseApi}/delete-file-siteform`;

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