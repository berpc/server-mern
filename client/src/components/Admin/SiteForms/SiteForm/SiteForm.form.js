import * as Yup from "yup";
import { siteCodes } from "../../../../utils/codes";

export function initialValues(site,period, year) {
  console.log(site)
  return {
    date: site?.date || "",
    creator_user: site?.creator_user || "",
    state: site?.state || "",
    period:site?.period || period,
    year:site?.year || year,
    installation_type: site?.installation_type || {
      code:siteCodes["installation_type"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    product_category: site?.product_category || {
      code:siteCodes["product_category"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    days_month:site?.days_month || {
      code:siteCodes["days_month"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    days_total:site?.days_total || {
      code:siteCodes["days_total"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    hours_month:site?.hours_month || {
      code:siteCodes["hours_month"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    hours_total:site?.hours_total || {
      code:siteCodes["hours_total"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    temporary_workers:site?.temporary_workers || {
      code:siteCodes["temporary_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    permanent_production_workers:site?.permanent_production_workers || {
      code:siteCodes["permanent_production_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    permanent_administrative_workers:site?.permanent_administrative_workers || {
      code:siteCodes["permanent_administrative_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    female_production_workers:site?.female_production_workers || {
      code:siteCodes["female_production_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    male_production_workers:site?.male_production_workers || {
      code:siteCodes["male_production_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    female_administrative_workers:site?.female_administrative_workers || {
      code:siteCodes["female_administrative_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    male_administrative_workers:site?.male_administrative_workers || {
      code:siteCodes["male_administrative_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    female_workers_leadership_positions:site?.female_workers_leadership_positions || {
      code:siteCodes["female_workers_leadership_positions"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    male_workers_leadership_positions:site?.male_workers_leadership_positions || {
      code:siteCodes["male_workers_leadership_positions"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    average_total_workers:site?.average_total_workers || {
      code:siteCodes["average_total_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    average_female_workers:site?.average_female_workers || {
      code:siteCodes["average_female_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    average_male_workers:site?.average_male_workers || {
      code:siteCodes["average_male_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    percentage_female_workers:site?.percentage_female_workers || {
      code:siteCodes["percentage_female_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    percentage_male_workers:site?.percentage_male_workers || {
      code:siteCodes["percentage_male_workers"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    
    percentage_total_female:site?.percentage_total_female || {
      code:siteCodes["percentage_total_female"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    percentage_total_male:site?.percentage_total_male || {
      code:siteCodes["percentage_total_male"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    percentage_female_leadership_positions:site?.percentage_female_leadership_positions || {
      code:siteCodes["percentage_female_leadership_positions"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    percentage_male_leadership_positions:site?.percentage_male_leadership_positions || {
      code:siteCodes["percentage_male_leadership_positions"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    work_accidents_with_sick_days:site?.work_accidents_with_sick_days || {
      code:siteCodes["work_accidents_with_sick_days"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
    first_aid_without_sick_days:site?.first_aid_without_sick_days || {
      code:siteCodes["first_aid_without_sick_days"],
      value:"",
      reviews:[
      ],
      files:[],
      isApproved:false
    },
  };
}

export function validationSchema() {
  return Yup.object({
    period: Yup.string("Dato requerido").required("El campo periodo es obligatorio"),
  });
}