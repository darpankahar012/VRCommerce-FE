import Index from "components/Owner/Dashboard/DashboardOwner";
import Restaurants from "components/Owner/Restaurants/Restaurants";
import Orders from "./components/Owner/Order/OrderOwner";
import LiveOrder from "./components/Owner/LiveOrder/LiveOrder";
import Menu from "components/Owner/Menu/Menu";
import Finance from "components/Owner/Finance/Finance";
import OwnerDriver from "components/Owner/OwnerDriver/OwnerDriver";
import subscriptionPlan from "./components/Owner/SubscriptionPlan/SubscriptionPlan";
import AddTour from "./components/tour/addtour";

export const ownerRoutes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
  },
  // {
  //   path: "/index",
  //   name: "Tour",
  //   icon: "ni ni-tv-2 text-primary",
  //   component: Index,
  // },

  {
    path: "/addTour",
    name: "Tour",
    icon: "ni ni-tv-2 text-primary",
    component: AddTour,
  },
  // {
  //   path: "/subscriptionPlan",
  //   name: "Subscription Plan",
  //   icon: "ni ni-planet text-blue",
  //   component: subscriptionPlan,
  // },
  // {
  //   path: "/liveOrder",
  //   name: "Live Orders",
  //   icon: "ni ni-planet text-blue",
  //   component: LiveOrder,
  // },
  // {
  //   path: "/orders",
  //   name: "Orders",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Orders,
  // },
  // {
  //   path: "/restaurants",
  //   name: "Clients",
  //   icon: "ni ni-shop text-blue",
  //   component: Restaurants,
  // },
  // {
  //   path: "/menu",
  //   name: "Product",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Menu,
  // },
  // {
  //   path: "/finance",
  //   name: "Finance",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Finance,
  // },
  // {
  //   path: "/add_owner_driver",
  //   name: "OwnerDriver",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: OwnerDriver,
  // },
];

export default ownerRoutes;
