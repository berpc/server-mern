import * as Yup from "yup";

export function initialValues(site) {
  return {
    date: site?.date || "",
    creator_user: site?.creator_user || "",
    state: site?.state || "",
    company: site?.company || "",
    reviews:site?.reviews || "",
    installation_type: site?.installation_type || "",
    product_category: site?.product_category || "",
    days_month:site?.days_month || "",
    days_total:site?.days_total || "",
    hours_month:site?.hours_month || "",
    hours_total:site?.hours_total || "",
    temporary_workers:site?.temporary_workers || "",
    permanent_production_workers:site?.permanent_production_workers || "",
    permanent_administrative_workers:site?.permanent_administrative_workers || "",
    female_production_workers:site?.female_production_workers || "",
    male_production_workers:site?.male_production_workers || "",
    female_administrative_workers:site?.female_administrative_workers || "",
    male_administrative_workers:site?.male_administrative_workers || "",
    female_workers_leadership_positions:site?.female_workers_leadership_positions || "",
    male_workers_leadership_positions:site?.male_workers_leadership_positions || "",
    // average_total_workers
    // average_female_workers
    // average_male_workers
    // percentage_total_female
    // percentage_total_male
    // percentage_female_leadership_positions
    // males_Leadership_positions 
    work_accidents_with_sick_days:site?.work_accidents_with_sick_days || "",
    first_aid_without_sick_days:site?.first_aid_without_sick_days || "",
    active:site?.active || ""
  };
}

export function validationSchema() {
  return Yup.object({
    title: Yup.string().required(true),
    miniature: Yup.string().required(true),
    description: Yup.string().required(true),
    url: Yup.string().required(true),
    price: Yup.number().required(true),
    score: Yup.number().min(1, true).max(5, true).required(true),
  });
}
