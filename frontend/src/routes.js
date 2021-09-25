import Index from "components/Dashboard/Pages/Dashboard/Index";
import Restaurants from "components/Dashboard/Pages/Restaurants/Restaurants";
import Orders from "components/Dashboard/Pages/Order/Orders";
import Pages from "components/Dashboard/Pages/PagesFooterLink/PageList";
import Clients from "components/Dashboard/Pages/Client/ClientList";
import DriverList from "./components/Dashboard/Pages/Driver/DriverList";
import LiveOrder from "components/Dashboard/Pages/LiveOrder/LiveOrder";
import Settings from "components/Dashboard/Pages/SiteSetting/Setting";
import Review from "components/Dashboard/Pages/Review/Review";
import CityList from "components/Dashboard/Pages/City/CityList";
import Finances from "components/Dashboard/Pages/Finances/Finances";
import PlanList from "components/Dashboard/Pages/SubScriptionPlan/PlanList";

const adminRoutes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
  },
  {
    path: "/subscriptionPlan",
    name: "Subscription Plan",
    icon: "ni ni-circle-08 text-pink",
    component: PlanList,
  },
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
  //   path: "/drivers",
  //   name: "Drivers",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: DriverList,
  // },
  // {
  //   path: "/clients",
  //   name: "Clients",
  //   icon: "ni ni-key-25 text-info",
  //   component: Clients,
  // },
  {
    path: "/companies",
    name: "Companies",
    icon: "ni ni-single-02 text-yellow",
    component: Restaurants,
  },
  // {
  //   path: "/review",
  //   name: "Review",
  //   icon: "ni ni-key-25 text-info",
  //   component: Review,
  // },
  // {
  //   path: "/city",
  //   name: "City",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: CityList,
  // },
  // {
  //   path: "/pages",
  //   name: "Pages",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: Pages,
  // },
  // {
  //   path: "/finances",
  //   name: "Finance",
  //   icon: "ni ni-key-25 text-info",
  //   component: Finances,
  // },
  // {
  //   path: "/settings",
  //   name: "Settings",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: Settings,
  // },
];

export default adminRoutes;
