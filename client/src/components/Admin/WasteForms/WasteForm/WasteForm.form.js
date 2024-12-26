import * as Yup from "yup";
import { wasteCodes } from "../../../../utils/codes";

const unitValue= "Kg";

export function initialValues(form, period, year) {
  return {
    date: form?.date || "",
    creator_user: form?.creator_user || "",
    period:form?.period || period,
    year:form?.year || year,
    state: form?.state || "",
    paper_and_cardboard_sent_to_recycling_or_reuse: form?.paper_and_cardboard_sent_to_recycling_or_reuse || {
      code:wasteCodes["paper_and_cardboard_sent_to_recycling_or_reuse"],
      unit:unitValue,
      reviews:[
      ],
        isApproved:false, files:[]
    },
    plastic_sent_to_recycle_or_reuse: form?.plastic_sent_to_recycle_or_reuse || {
      code:wasteCodes["plastic_sent_to_recycle_or_reuse"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    fabric_sent_to_recycle_or_reuse:form?.fabric_sent_to_recycle_or_reuse || {
      code:wasteCodes["fabric_sent_to_recycle_or_reuse"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    metal_sent_to_recycle_or_reuse:form?.metal_sent_to_recycle_or_reuse || {
      code:wasteCodes["metal_sent_to_recycle_or_reuse"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    wood_sent_to_recycle_or_reuse:form?.wood_sent_to_recycle_or_reuse || {
      code:wasteCodes["wood_sent_to_recycle_or_reuse"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    other_general_waste_sent_to_recycle_or_reuse:form?.other_general_waste_sent_to_recycle_or_reuse || {
      code:wasteCodes["other_general_waste_sent_to_recycle_or_reuse"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    leathers_sent_to_recycle_or_reuse:form?.leathers_sent_to_recycle_or_reuse || {
      code:wasteCodes["leathers_sent_to_recycle_or_reuse"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    rubber_sent_to_recycle_or_reuse:form?.rubber_sent_to_recycle_or_reuse || {
      code:wasteCodes["rubber_sent_to_recycle_or_reuse"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    food_scraps_sent_to_recycle_or_reuse:form?.food_scraps_sent_to_recycle_or_reuse || {
      code:wasteCodes["food_scraps_sent_to_recycle_or_reuse"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    paper_and_cardboard_sent_to_incineration:form?.paper_and_cardboard_sent_to_incineration || {
      code:wasteCodes["paper_and_cardboard_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    plastic_sent_to_incineration:form?.plastic_sent_to_incineration || {
      code:wasteCodes["plastic_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    fabric_sent_to_incineration:form?.fabric_sent_to_incineration || {
      code:wasteCodes["fabric_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    metal_sent_to_incineration:form?.metal_sent_to_incineration || {
      code:wasteCodes["metal_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    wood_sent_to_incineration:form?.wood_sent_to_incineration || {
      code:wasteCodes["wood_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    other_general_waste_sent_to_incineration:form?.other_general_waste_sent_to_incineration || {
      code:wasteCodes["other_general_waste_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    other_general_waste_sent_to_other_types_of_disposal:form?.other_general_waste_sent_to_other_types_of_disposal || {
      code:wasteCodes["other_general_waste_sent_to_other_types_of_disposal"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    total_sent_to_landfill:form?.total_sent_to_landfill || {
      code:wasteCodes["total_sent_to_landfill"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    total_sent_for_reuse_or_recycling:form?.total_sent_for_reuse_or_recycling || {
      code:wasteCodes["total_sent_for_reuse_or_recycling"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    total_sent_to_incineration:form?.total_sent_to_incineration || {
      code:wasteCodes["total_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    
    total_general_waste_sent_to_other_types_of_disposal:form?.total_general_waste_sent_to_other_types_of_disposal || {
      code:wasteCodes["total_general_waste_sent_to_other_types_of_disposal"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
    total_non_hazardous_waste_unit_produced:form?.total_non_hazardous_waste_unit_produced || {
      code:wasteCodes["total_non_hazardous_waste_unit_produced"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
        isApproved:false, files:[]
    },
  };
}

export function validationSchema() {
  return Yup.object({
    period: Yup.string("Dato requerido").required("El campo periodo es obligatorio"),
  });
}
