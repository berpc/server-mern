import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "../layouts";
import {
  Auth,
  Users,
  Menu,
  Roles,
  Permissions,
  Dashboard,
  Reports,
  Companies,
  Recover,
  SiteForms,
  Sites,
  NewSiteForm,
  EnergyForms,
  ProductionForms,
  EffluentForms,
  WaterForms
} from "../pages/admin";
import { useAuth } from "../hooks";

export function AdminRouter() {
  const { user } = useAuth();

  //console.log(user)
  const loadLayout = (Layout, Page) => {
    return (
      <Layout>
        <Page />
      </Layout>
    );
  };

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/admin/*" element={<Auth />} />
          <Route path="/recover" element={<Recover />} />
        </>
      ) : (
        <>
          {["/admin", "/admin/dashboard"].map((path) => (
            <Route
              key={path}
              path={path}
              element={loadLayout(AdminLayout, Dashboard)}
            />
          ))}
          <Route path="/admin/users" element={loadLayout(AdminLayout, Users)} />
          {/* <Route
            path="/admin/courses"
            element={loadLayout(AdminLayout, Courses)}
          /> */}
          <Route
            path="/admin/config/roles"
            element={loadLayout(AdminLayout, Roles)}
          />
          <Route
            path="/admin/config/permissions"
            element={loadLayout(AdminLayout, Permissions)}
          />
          <Route path="/admin/menu" element={loadLayout(AdminLayout, Menu)} />
          {/* <Route
            path="/admin/newsletter"
            element={loadLayout(AdminLayout, Newsletter)}
          /> */}

          <Route
            path="/admin/reports"
            element={loadLayout(AdminLayout, Reports)}
          />

          <Route
            path="/admin/dashboard"
            element={loadLayout(AdminLayout, Dashboard)}
          />

          <Route
            path="/admin/companies"
            element={loadLayout(AdminLayout, Companies)}
          />

          <Route path="/admin/sites" element={loadLayout(AdminLayout, Sites)} />

          <Route
            path="/admin/data/siteforms"
            element={loadLayout(AdminLayout, SiteForms)}
          />

          <Route
            path="/admin/siteforms/newsiteform"
            element={loadLayout(AdminLayout, NewSiteForm)}
          />

          <Route
            path="/admin/data/energyforms"
            element={loadLayout(AdminLayout, EnergyForms)}
          />

<Route
            path="/admin/data/productionforms"
            element={loadLayout(AdminLayout, ProductionForms)}
          />
<Route
            path="/admin/data/effluentforms"
            element={loadLayout(AdminLayout, EffluentForms)}
          />
<Route
            path="/admin/data/waterforms"
            element={loadLayout(AdminLayout, WaterForms)}
          />
        </>
      )}
    </Routes>
  );
}
