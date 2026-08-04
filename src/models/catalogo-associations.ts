import Categorias from "./categoria-model";
import Prato from "./prato-model";

let configured = false;

export function configureCatalogAssociations(): void {
  if (configured) return;

  Categorias.hasMany(Prato, {
    foreignKey: "categoriaId",
    as: "pratos",
  });

  Prato.belongsTo(Categorias, {
    foreignKey: "categoriaId",
    as: "categoria",
  });

  configured = true;
}
