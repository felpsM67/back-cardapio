export const PERMISSOES_CARGO = [
  "view_dashboard",
  "manage_products",
  "manage_categories",
  "manage_addons",
  "manage_promotions",
  "view_orders",
  "manage_orders",
  "cancel_orders",
  "manage_deliveries",
  "manage_settings",
  "manage_roles",
  "manage_employees",
  "manage_couriers",
] as const;

export type PermissaoCargo =
  (typeof PERMISSOES_CARGO)[number];