import { ENV } from "../utils";

export class Energyform {
  baseApi = ENV.BASE_API;

  async getEnergyForm(accessToken, idEnergyForm) {
    try {
      const url = `${this.baseApi}/energy/${idEnergyForm}`;
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

  async createEnergyForm(accessToken, data) {
    try {
      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}`;
      const url = `${this.baseApi}/add-energy`;
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

  async getEnergyForms(accessToken, paramsEnergy, active = undefined) {
    try {
      const pageFilter = `page=${paramsEnergy?.page || 1}`;
      const limitFilter = `limit=${paramsEnergy?.limit || 10}`;
      const siteFilter = `site=${paramsEnergy?.site || undefined}`
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USERS}?active=${active}`;
      let url=`${this.baseApi}/energys?${pageFilter}&${limitFilter}`;
      if(active !== undefined){
        url = `${this.baseApi}/energys?active=${active}&${pageFilter}&${limitFilter}`;
      }
      if(paramsEnergy?.site){
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

  async updateEnergyForm(accessToken, idEnergyForm, energyformData) {
    try {
      const data = energyformData;

      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   formData.append(key, data[key]);
      // });

      // const url = `${ENV.BASE_API}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${ENV.BASE_API}/update-energy/${idEnergyForm}`;
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

  async deleteEnergyForm(accessToken, idEnergyForm) {
    try {
      // const url = `${this.baseApi}/${ENV.API_ROUTES.USER}/${idUser}`;
      const url = `${this.baseApi}/delete-energy/${idEnergyForm}`;
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

  async existsEnergyFormByPeriodAndYear(accessToken, siteId, period, year) {
    try {
      const url = `${this.baseApi}/energy-exists-site/${siteId}/${period}/${year}`;
      
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

  async getPeriodsEnergyFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/energies-periods-site-year/${siteId}/${year}`;
      
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
  
  async getEnergyFormsBySiteAndYear(accessToken, siteId, year) {
    try {
      const url = `${this.baseApi}/energies-site-year/${siteId}/${year}`;
      
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
    const url = `${this.baseApi}/upload-file-energy/`;

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
    const url = `${this.baseApi}/get-file-energy/${fileName}`;
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
    const url = `${this.baseApi}/delete-file-energy`;

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