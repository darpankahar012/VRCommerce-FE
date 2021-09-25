import { REHYDRATE } from "redux-persist";

let initState = {
  email: null,
  userData: {},
  token: null,
  ownerprofileupdate: {},
  city: null,
  getownerprofile: {},
  ownerId: null,
  getrestaurantmenu: {},
  AddNewCategory: {},
  DeleteMenuCategory: {},
  StoreDishidForEdit: {},
  UpdateDishItem: {},
  AddDish: {},
  AddDish: {},
  dishData: {},
  StoreVariantForOption: {},
  GetDishItemInUpdate: {},
  StoreVariantOptionIdForOption: {},
  AddNewVariant: {},
  AddExtras: {},
  GetVariantDetails: {},
  GetExtras: {},
  GetcityListWithId: {},
  GetRestaurantDeatilAdmin: {},
  EditCityDetail: {},
  Page_Id: null,
  StoreRestaurantId: {},
  All_id: null,
  EditDriverDetail: {},
  Cart_List: {},
  orderDetails: {},
  client_secret: null,
  stripeUserId: null,
  get_fcm_registration_token: null,
  orderDetails: {},
  client_secret: null,
  stripeUserId: null,
  cityId: null,
  ownerDataForPlan: {},
  selectedPlan: {},
  registrationToken: null,
  storeCurrentPlan: {},
  registerTimeUserData: {},
};

function armenuReducer(state = initState, action) {
  switch (action.type) {
    case "FORGOT_PASSWORD_EMAIL":
      return {
        ...state,
        email: action.res,
      };
    case "REGISTER_TIME_USER_DATA":
      return {
        ...state,
        registerTimeUserData: action.res,
      };
    case "LOGIN_USER_DETAIL":
      return {
        ...state,
        userData: action.res,
      };
    case "TOKEN_KEY":
      return {
        ...state,
        token: action.res,
      };
    case "GET_FCM_REGISTRATION_TOKEN":
      return {
        ...state,
        get_fcm_registration_token: action.res,
      };
    case "STORE_CITY":
      return {
        ...state,
        city: action.res,
      };
    case "STORE_RESTAURANT":
      return {
        ...state,
        ownerId: action.res,
      };
    case "DESTOROY_SESSION":
      return {
        ...state,
        email: null,
        userData: {},
        token: null,
        Cart_List: {},
      };
    case "OWNER_PROFILE_UPDATE":
      return {
        ...state,
        ownerprofileupdate: action.res,
      };
    case "GET_OWNER_PROFILE_DATA":
      return {
        ...state,
        getownerprofile: action.res,
      };
    case "GET_RESTAURANT_MENU":
      return {
        ...state,
        getrestaurantmenu: action.res,
      };

    case "ADD_NEW_CATEGORY":
      return {
        ...state,
        AddNewCategory: action.res,
      };
    case "DELETE_MENU_CATEGORY":
      return {
        ...state,
        DeleteMenuCategory: action.res,
      };
    case "ADD_DISH":
      return {
        ...state,
        AddDish: action.res,
      };
    case "STORE_DISH_ID_FOR_EDIT":
      return {
        ...state,
        StoreDishidForEdit: action.res,
      };

    case "UPDATE_DISH_ITEM":
      return {
        ...state,
        UpdateDishItem: action.res,
      };

    case "STORE_VARIANT_FOR_OPTION":
      return {
        ...state,
        StoreVariantForOption: action.res,
      };

    case "GET_DISH_ITEM_IN_UPDATE":
      return {
        ...state,
        GetDishItemInUpdate: action.res,
      };

    case "STORE_VARIANT_OP_ID_FOR_OPTION":
      return {
        ...state,
        StoreVariantOptionIdForOption: action.res,
      };

    case "ADD_NEW_VARIANT":
      return {
        ...state,
        AddNewVariant: action.res,
      };

    case "GET_VARIANT_DETAILS":
      return {
        ...state,
        GetVariantDetails: action.res,
      };

    case "ADD_EXTRAS":
      return {
        ...state,
        AddExtras: action.res,
      };

    case "GET_EXTRAS":
      return {
        ...state,
        GetExtras: action.res,
      };

    case "GET_CITY_LIST_WITH_ID":
      return {
        ...state,
        GetcityListWithId: action.res,
      };

    case "GET_RESTAURANT_DEATIL_ADMIN":
      return {
        ...state,
        GetRestaurantDeatilAdmin: action.res,
      };

    case "GET_EDIT_CITY_DETAIL":
      return {
        ...state,
        EditCityDetail: action.res,
      };

    case "SET_PAGE_ID":
      return {
        ...state,
        Page_Id: action.res,
      };

    case "STORE_RESTAURANT_ID":
      return {
        ...state,
        StoreRestaurantId: action.res,
      };
    case "ALL_ID":
      return {
        ...state,
        All_id: action.res,
      };

    case "GET_EDIT_DRIVER_DETAIL":
      return {
        ...state,
        EditDriverDetail: action.res,
      };

    case "GET_LIST_CART":
      return {
        ...state,
        Cart_List: action.res,
      };

    case "STORE_ORDER_DETAILS":
      return {
        ...state,
        orderDetails: action.res,
      };

    case "STORE_CLIENT_SECRET_KEY":
      return {
        ...state,
        client_secret: action.res,
      };

    case "STORE_STRIPE_USER_ID":
      return {
        ...state,
        stripeUserId: action.res,
      };

    case "STORE_CITY_ID":
      return {
        ...state,
        cityId: action.res,
      };

    case "STORE_OWNER_DATA_FOR_PLAN_SELECTION":
      return {
        ...state,
        ownerDataForPlan: action.res,
      };
    case "SELECTED_PLAN_INFO":
      return {
        ...state,
        selectedPlan: action.res,
      };
    case "REGISTRATION_TOKEN":
      return {
        ...state,
        registrationToken: action.res,
      };
    case "STORE_CURRENT_PLAN":
      return {
        ...state,
        storeCurrentPlan: action.res,
      };

    case REHYDRATE:
      return {
        ...state,
        email:
          action.payload && action.payload.email ? action.payload.email : null,
        userData:
          action.payload && action.payload.userData
            ? action.payload.userData
            : {},
        ownerprofileupdate:
          action.payload && action.payload.ownerprofileupdate
            ? action.payload.ownerprofileupdate
            : {},
        getownerprofile:
          action.payload && action.payload.getownerprofile
            ? action.payload.getownerprofile
            : {},
        getrestaurantmenu:
          action.payload && action.payload.getrestaurantmenu
            ? action.payload.getrestaurantmenu
            : {},
        AddNewCategory:
          action.payload && action.payload.AddNewCategory
            ? action.payload.AddNewCategory
            : {},
        GetcityListWithId:
          action.payload && action.payload.GetcityListWithId
            ? action.payload.GetcityListWithId
            : {},
        All_id:
          action.payload && action.payload.All_id
            ? action.payload.All_id
            : null,
        DeleteMenuCategory:
          action.payload && action.payload.DeleteMenuCategory
            ? action.payload.DeleteMenuCategory
            : {},
        StoreDishidForEdit:
          action.payload && action.payload.StoreDishidForEdit
            ? action.payload.StoreDishidForEdit
            : {},
        UpdateDishItem:
          action.payload && action.payload.UpdateDishItem
            ? action.payload.UpdateDishItem
            : {},
        GetRestaurantDeatilAdmin:
          action.payload && action.payload.GetRestaurantDeatilAdmin
            ? action.payload.GetRestaurantDeatilAdmin
            : {},
        StoreVariantForOption:
          action.payload && action.payload.StoreVariantForOption
            ? action.payload.StoreVariantForOption
            : {},
        GetVariantDetails:
          action.payload && action.payload.GetVariantDetails
            ? action.payload.GetVariantDetails
            : {},
        AddNewVariant:
          action.payload && action.payload.AddNewVariant
            ? action.payload.AddNewVariant
            : {},
        AddDish:
          action.payload && action.payload.AddDish
            ? action.payload.AddDish
            : {},
        AddExtras:
          action.payload && action.payload.AddExtras
            ? action.payload.AddExtras
            : {},
        GetExtras:
          action.payload && action.payload.GetExtras
            ? action.payload.GetExtras
            : {},
        GetDishItemInUpdate:
          action.payload && action.payload.GetDishItemInUpdate
            ? action.payload.GetDishItemInUpdate
            : {},
        EditCityDetail:
          action.payload && action.payload.EditCityDetail
            ? action.payload.EditCityDetail
            : {},
        StoreRestaurantId:
          action.payload && action.payload.StoreRestaurantId
            ? action.payload.StoreRestaurantId
            : {},
        Page_Id:
          action.payload && action.payload.Page_Id
            ? action.payload.Page_Id
            : null,
        EditDriverDetail:
          action.payload && action.payload.EditDriverDetail
            ? action.payload.EditDriverDetail
            : {},
        Cart_List:
          action.payload && action.payload.Cart_List
            ? action.payload.Cart_List
            : {},
        orderDetails:
          action.payload && action.payload.orderDetails
            ? action.payload.orderDetails
            : {},
        client_secret:
          action.payload && action.payload.client_secret
            ? action.payload.client_secret
            : null,
        stripeUserId:
          action.payload && action.payload.stripeUserId
            ? action.payload.stripeUserId
            : null,
        cityId:
          action.payload && action.payload.cityId
            ? action.payload.cityId
            : null,
        token:
          action.payload && action.payload.token ? action.payload.token : null,
        get_fcm_registration_token:
          action.payload && action.payload.get_fcm_registration_token
            ? action.payload.get_fcm_registration_token
            : null,
        city:
          action.payload && action.payload.city ? action.payload.city : null,
        dishData:
          action.payload && action.payload.dishData
            ? action.payload.dishData
            : {},
        ownerDataForPlan:
          action.payload && action.payload.ownerDataForPlan
            ? action.payload.ownerDataForPlan
            : {},

        selectedPlan:
          action.payload && action.payload.selectedPlan
            ? action.payload.selectedPlan
            : {},

        registrationToken:
          action.payload && action.payload.registrationToken
            ? action.payload.registrationToken
            : null,

        storeCurrentPlan:
          action.payload && action.payload.storeCurrentPlan
            ? action.payload.storeCurrentPlan
            : {},

        registerTimeUserData:
          action.payload && action.payload.registerTimeUserData
            ? action.payload.registerTimeUserData
            : {},
      };
    default:
      return {
        ...state,
      };
  }
}

export const reducer = armenuReducer;
