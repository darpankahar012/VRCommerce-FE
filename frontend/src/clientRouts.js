import Orders from "./components/Client/Orders";
import MyAddress from "./components/Client/MyAddress"

export const clientsRoutes=[
    {
      path: "/orders",
      name: "My Orders",
      icon: "ni ni-pin-3 text-orange",
      component: Orders,
    },
    {
        path: "/myAddress",
        name: "My Address",
        icon: "ni ni-pin-3 text-orange",
        component: MyAddress,
      }
]
export default clientsRoutes;