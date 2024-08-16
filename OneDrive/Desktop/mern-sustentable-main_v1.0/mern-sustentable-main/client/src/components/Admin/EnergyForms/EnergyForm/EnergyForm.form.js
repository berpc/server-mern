import * as Yup from "yup";

export function initialValues(site) {
  return {
    date: site?.date || "",
    creator_user: site?.creator_user || "",
    state: site?.state || "",
    installation_type: site?.installation_type || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    product_category: site?.product_category || {
      value:"",
      reviews:[
      ]
    },
    days_month:site?.days_month || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    days_total:site?.days_total || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    hours_month:site?.hours_month || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    hours_total:site?.hours_total || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    temporary_workers:site?.temporary_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    permanent_production_workers:site?.permanent_production_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    permanent_administrative_workers:site?.permanent_administrative_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    female_production_workers:site?.female_production_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    male_production_workers:site?.male_production_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    female_administrative_workers:site?.female_administrative_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    male_administrative_workers:site?.male_administrative_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    female_workers_leadership_positions:site?.female_workers_leadership_positions || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    male_workers_leadership_positions:site?.male_workers_leadership_positions || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    average_total_workers:site?.average_total_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    average_female_workers:site?.average_female_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    average_male_workers:site?.average_male_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    percentage_female_workers:site?.percentage_female_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    percentage_male_workers:site?.percentage_male_workers || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    
    percentage_total_female:site?.percentage_total_female || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    percentage_total_male:site?.percentage_total_male || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    percentage_female_leadership_positions:site?.percentage_female_leadership_positions || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    percentage_male_leadership_positions:site?.percentage_male_leadership_positions || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    work_accidents_with_sick_days:site?.work_accidents_with_sick_days || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
    first_aid_without_sick_days:site?.first_aid_without_sick_days || {
      value:"",
      reviews:[
      ],
      isApproved:false
    },
  };
}

export function validationSchema() {
  // return Yup.object({
  //   date: Yup.string().required(true),
  //   creator_user: Yup.string().required(true),
  //   state: Yup.string().required(true),
  //   installation_type: Yup.object({
  //     value: Yup.string().required(),
  //   }),
  // });
}
