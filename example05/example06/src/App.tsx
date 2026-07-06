import { Admin, Resource, ShowGuesser, EditGuesser, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { dataProvider } from "./dataProvider";
import { Dashboard } from "./Dashboard";
import { authProvider } from "./authProvider";
import { CategoryCreate, CategoryEdit, CategoryList } from "./component/Category";
import { ProductCreate, ProductEdit, ProductList } from "./component/Product";
import ProductImageUpdate from "./component/ProductImageUpdate";
import { CartList, CartShow } from "./component/Cart";
import { OrderList, OrderShow, OrderEdit } from "./component/Orders";
import { UserList, UserEdit } from "./component/users";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import UserIcon from "@mui/icons-material/Person";
import { BannerList, BannerEdit, BannerCreate } from "./component/Banners";
import BannerImageUpdate from "./component/BannerImageUpdate";
import CategoryImageUpdate from "./component/CategoryImageUpdate";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";

export const App = () => (
    <Admin authProvider={authProvider} layout={Layout} dataProvider={dataProvider} dashboard={Dashboard}>

        <Resource
            name="categories"
            list={CategoryList}
            create={CategoryCreate}
            edit={CategoryEdit}
            icon={CategoryIcon}
        />
        <Resource
            name="products"
            list={ProductList}
            create={ProductCreate}
            edit={ProductEdit}
            icon={Inventory2Icon}
        />

        <Resource
            name="carts" 
            list={CartList}
            show={CartShow}
            icon={ShoppingCartIcon}
        />
        <Resource name="orders" list={OrderList} show={OrderShow} edit={OrderEdit} icon={LocalAtmIcon}/>
        <Resource name="users" list={UserList} edit={UserEdit} icon={UserIcon}/>
        <Resource
            name="banners"
            list={BannerList}
            create={BannerCreate}
            edit={BannerEdit}
            icon={ViewCarouselIcon}
        />
        <CustomRoutes>
            <Route path="/products/:id/update-image" element={<ProductImageUpdate />} />
            <Route path="/banners/:id/update-image" element={<BannerImageUpdate />} />
            <Route path="/categories/:id/update-image" element={<CategoryImageUpdate />} />
        </CustomRoutes>
    </Admin>
);