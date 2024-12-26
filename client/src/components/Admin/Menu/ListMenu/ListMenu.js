import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { size, map } from "lodash";
import { Menu } from "../../../../api";
import { MenuItem } from "../MenuItem";
import { useLanguage } from "../../../../contexts";

const menuController = new Menu();

export function ListMenu(props) {
  const { active, reload, onReload } = props;
  const [menus, setMenus] = useState(null);

  const { translations } = useLanguage();

  const t = (key) => translations[key] || key; // Función para obtener la traducción

  useEffect(() => {
    (async () => {
      try {
        setMenus(null);
        const repsonse = await menuController.getMenu(active);
        setMenus(repsonse);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [active, reload]);

  if (!menus) return <Loader active inline="centered" />;
  if (size(menus) === 0) return t("there_is_no_menu");

  return map(menus, (menu) => (
    <MenuItem key={menu._id} menu={menu} onReload={onReload} />
  ));
}
