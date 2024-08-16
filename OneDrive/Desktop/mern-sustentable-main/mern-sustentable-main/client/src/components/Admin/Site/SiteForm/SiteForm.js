import React, { useCallback } from "react";
import { Form, Image, Grid } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import { Site } from "../../../../api";
import { useAuth } from "../../../../hooks";
import { ENV } from "../../../../utils";
import { initialValues, validationSchema } from "./SiteForm.form";
import "./SiteForm.scss";

const siteController = new Site();

export function SiteForm(props) {
  const { onClose, onReload, course } = props;
  const { accessToken } = useAuth();

  const formik = useFormik({
    initialValues: initialValues(course),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (!course) {
          await siteController.createSite(accessToken, formValue);
        } else {
          await siteController.updateSite(accessToken, course._id, formValue);
        }

        onReload();
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Form className="site-form" onSubmit={formik.handleSubmit}>
      <Grid className="grid">
        <Grid.Row>
          {/* <Form.Group inline>
        <label>Tipo de instalacion</label>
        <Form.Input
          type="number"
          name="price"
          placeholder="Precio del curso"
          onChange={formik.handleChange}
          value={formik.values.price}
          error={formik.errors.price}
        />
      </Form.Group> */}

          <Grid.Column width={8}>
            <label className="label">Tipo de instalacion</label>
          </Grid.Column>
          <Grid.Column>
            <Form.Dropdown
              placeholder="Seleccione"
              // options={listRoles.map((ds) => {
              //   return {
              //     key: ds._id,
              //     text: ds.name,
              //     value: ds._id,
              //   };
              // })}
              selection
              onChange={(_, data) => formik.setFieldValue("installation_type", data.value)}
              value={formik.values.installation_type}
              error={formik.errors.installation_type}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <label className="label">Categoria de productos</label>
          </Grid.Column>
          <Grid.Column>
            <Form.Dropdown
              placeholder="Seleccione"
              // options={listRoles.map((ds) => {
              //   return {
              //     key: ds._id,
              //     text: ds.name,
              //     value: ds._id,
              //   };
              // })}
              selection
              onChange={(_, data) => formik.setFieldValue("product_category", data.value)}
              value={formik.values.product_category}
              error={formik.errors.product_category}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <label className="label">Dias trabajados en el mes</label>
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Input
              type="number"
              name="days_month"
              onChange={formik.handleChange}
              value={formik.values.days_month}
              error={formik.errors.days_month}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <label className="label">Dias totales trabajados</label>
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Input
              type="number"
              name="days_total"
              disabled={true}
              placeholder="Precio del curso"
              onChange={formik.handleChange}
              value={formik.values.days_total}
              error={formik.errors.days_total}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <label className="label">Horas trabajadas en el mes</label>
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Input
              type="number"
              name="hours_month"
              onChange={formik.handleChange}
              value={formik.values.hours_month}
              error={formik.errors.hours_month}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <label className="label">Horas totales trabajadas</label>
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Input
              type="number"
              name="hours_total"
              disabled={true}
              onChange={formik.handleChange}
              value={formik.values.hours_total}
              error={formik.errors.hours_total}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <label className="label">Cantidad de trabajadores temporales</label>
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Input
              type="number"
              name="temporary_workers"
              onChange={formik.handleChange}
              value={formik.values.temporary_workers}
              error={formik.errors.temporary_workers}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <label className="label">Cantidad de trabajadores de produccion permanentes</label>
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Input
              type="number"
              name="permanent_production_workers"
              onChange={formik.handleChange}
              value={formik.values.permanent_production_workers}
              error={formik.errors.permanent_production_workers}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Cantidad de trabajadores administrativos permanentes</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="permanent_administrative_workers"
            onChange={formik.handleChange}
            value={formik.values.permanent_administrative_workers}
            error={formik.errors.permanent_administrative_workers}
          />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Cantidad de trabajadoras de produccion femeninas</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="female_production_workers"
            onChange={formik.handleChange}
            value={formik.values.female_production_workers}
            error={formik.errors.female_production_workers}
          />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Cantidad de trabajadores de produccion masculinos</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="male_production_workers"
            onChange={formik.handleChange}
            value={formik.values.male_production_workers}
            error={formik.errors.male_production_workers}
          />
              </Grid.Column>
        </Grid.Row>

        
        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Cantidad de trabajadoras administrativas femeninas</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="female_administrative_workers"
            onChange={formik.handleChange}
            value={formik.values.female_administrative_workers}
            error={formik.errors.female_administrative_workers}
          />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Cantidad de trabajadores administrativos masculinos</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="male_administrative_workers"
            onChange={formik.handleChange}
            value={formik.values.male_administrative_workers}
            error={formik.errors.male_administrative_workers}
          />
          </Grid.Column>
        </Grid.Row>


        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">
            Cantidad de trabajadoras femeninas en posiciones de liderazgo
          </label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="female_workers_leadership_positions"
            onChange={formik.handleChange}
            value={formik.values.female_workers_leadership_positions}
            error={formik.errors.female_workers_leadership_positions}
          />
             </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">
            Cantidad de trabajadores masculinos en posiciones de liderazgo
          </label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="male_workers_leadership_positions"
            onChange={formik.handleChange}
            value={formik.values.male_workers_leadership_positions}
            error={formik.errors.male_workers_leadership_positions}
          />
              </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Cantidad promedio de trabajadores totales</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="average_total_workers"
            onChange={formik.handleChange}
            value={formik.values.average_total_workers}
            error={formik.errors.average_total_workers}
          />
            </Grid.Column>
        </Grid.Row>


        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Promedio de trabajadoras femeninas</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="average_female_workers"
            onChange={formik.handleChange}
            value={formik.values.average_female_workers}
            error={formik.errors.average_female_workers}
          />
            </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Promedio de trabajadores masculinos</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="average_male_workers"
            onChange={formik.handleChange}
            value={formik.values.average_male_workers}
            error={formik.errors.average_male_workers}
          />
            </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">% de trabajadoras femeninas</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="percentage_female_workers"
            onChange={formik.handleChange}
            value={formik.values.percentage_female_workers}
            error={formik.errors.percentage_female_workers}
          />
            </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">% de trabajadores masculinos</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="percentage_female_workers"
            onChange={formik.handleChange}
            value={formik.values.percentage_male_workers}
            error={formik.errors.percentage_female_workers}
          />
            </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">% de mujeres totales</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="percentage_total_female"
            onChange={formik.handleChange}
            value={formik.values.percentage_total_female}
            error={formik.errors.percentage_total_female}
          />
            </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">% de hombres totales</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="percentage_total_male"
            onChange={formik.handleChange}
            value={formik.values.percentage_total_male}
            error={formik.errors.percentage_total_male}
          />
        </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">% de femeninas en posicion de liderazgo</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="percentage_female_leadership_positions"
            onChange={formik.handleChange}
            value={formik.values.percentage_female_leadership_positions}
            error={formik.errors.percentage_female_leadership_positions}
          />
        </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">% de masculinos en posicion de liderazgo</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="price"
            placeholder="Precio del curso"
            onChange={formik.handleChange}
            value={formik.values.percentage_male_leadership_positions}
            error={formik.errors.percentage_male_leadership_positions}
          />
        </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">Accidentes de trabajo con dias de baja (+ de uno)</label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="work_accidents_with_sick_days"
            onChange={formik.handleChange}
            value={formik.values.work_accidents_with_sick_days}
            error={formik.errors.work_accidents_with_sick_days}
          />
        </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          <label className="label">
            Primeros auxilios sin dias de baja (continua trabajando)
          </label>
          </Grid.Column>
          <Grid.Column width={4}>
          <Form.Input
            type="number"
            name="first_aid_without_sick_days"
            onChange={formik.handleChange}
            value={formik.values.first_aid_without_sick_days}
            error={formik.errors.first_aid_without_sick_days}
          />
        </Grid.Column>
        </Grid.Row>

      </Grid>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {!course ? "Crear curso" : "Actualizar curso"}
      </Form.Button>
    </Form>
  );
}
