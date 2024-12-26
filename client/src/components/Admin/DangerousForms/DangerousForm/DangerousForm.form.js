import * as Yup from "yup";
import { dangerousCodes } from "../../../../utils/codes";

const currentYear = new Date().getFullYear();
const unitValue= "Kg";


export function initialValues(form, period, year) {
  return {
    date: form?.date || "",
    period: form?.period || period,
    year:form?.year || year,
    creator_user: form?.creator_user || "",
    state: form?.state || "",
    chemicals_sent_to_reuse_or_recycle: form?.chemicals_sent_to_reuse_or_recycle || {
      code:dangerousCodes["chemicals_sent_to_reuse_or_recycle"],
      unit:unitValue,
      value:0,
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    lubricants_sent_to_reuse_or_recycle: form?.lubricants_sent_to_reuse_or_recycle || {
      code:dangerousCodes["lubricants_sent_to_reuse_or_recycle"],
      unit:unitValue,
      value:0,
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    oils_sent_to_reuse_or_recycle:form?.oils_sent_to_reuse_or_recycle || {
      code:dangerousCodes["oils_sent_to_reuse_or_recycle"],
      unit:unitValue,
      value:0,
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    machines_and_equipment_sent_to_reuse_or_recycle:form?.machines_and_equipment_sent_to_reuse_or_recycle || {
      code:dangerousCodes["machines_and_equipment_sent_to_reuse_or_recycle"],
      unit:unitValue,
      value:0,
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    electronic_waste_sent_to_reuse_or_recycle:form?.electronic_waste_sent_to_reuse_or_recycle || {
      code:dangerousCodes["electronic_waste_sent_to_reuse_or_recycle"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    other_dangerous_wastes_sent_to_reuse_or_recycle:form?.other_dangerous_wastes_sent_to_reuse_or_recycle || {
      code:dangerousCodes["other_dangerous_wastes_sent_to_reuse_or_recycle"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    chemicals_sent_to_incineration:form?.chemicals_sent_to_incineration || {
      code:dangerousCodes["chemicals_sent_to_incineration"],
      unit:unitValue,
      value:0,
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    lubricants_sent_to_incineration:form?.lubricants_sent_to_incineration || {
      code:dangerousCodes["lubricants_sent_to_incineration"],
      unit:unitValue,
      value:0,
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    oils_sent_to_incineration:form?.oils_sent_to_incineration || {
      code:dangerousCodes["oils_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    machines_and_equipment_sent_to_incineration:form?.machines_and_equipment_sent_to_incineration || {
      code:dangerousCodes["machines_and_equipment_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    electronic_waste_sent_to_incineration:form?.electronic_waste_sent_to_incineration || {
      code:dangerousCodes["electronic_waste_sent_to_incineration"],
      unit:unitValue,
      value:0,
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    other_dangerous_wastes_sent_to_incineration:form?.other_dangerous_wastes_sent_to_incineration || {
      code:dangerousCodes["other_dangerous_wastes_sent_to_incineration"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    chemicals_sent_to_landfill:form?.chemicals_sent_to_landfill || {
      code:dangerousCodes["chemicals_sent_to_landfill"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
      isApproved:false,
      files:[]
    },
    lubricants_sent_to_landfill:form?.lubricants_sent_to_landfill || {
      code:dangerousCodes["lubricants_sent_to_landfill"],
      unit:unitValue,
      value:"",
      reviews:[
      ],
      isApproved:false,
      files:[]
    }
  };
}

export function validationSchema() {
  return Yup.object({
    period: Yup.string("Dato requerido").required("El campo periodo es obligatorio"),
  });
}
