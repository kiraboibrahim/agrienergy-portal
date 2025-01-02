import { lazy } from "react";
import { lazily } from "react-lazily";
import FarmerList from "../components/FarmerList/FarmerList";
import { AllProductList } from "../components/ProductList/Product.List";
import EscoList from "../components/EscoList/EscoList";
import GroupList from "../components/GroupList/GroupList";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../components/Main/Main";
import Login from "../components/Login/Login";
import SuperAdminRequired from "../components/SuperAdminRequired/SuperAdminRequired";
import { Suspense } from "react";
import Loading from "../components/common/utils/Loading";

import { PromoteProductModalContextProvider } from "../components/ProductDetail/PromoteProductModal";
import { LearningModalContextProvider } from "../components/ProductDetail/CreateLearningMaterialModal";
import AgroProcessorList from "../components/AgroProcessorList/AgroProcessorList";
const FarmerDetail = lazy(() =>
  import("../components/FarmerDetail/FarmerDetail")
);
const EscoDetail = lazy(() => import("../components/EscoDetail/EscoDetail"));
const { EscoProductList } = lazily(() =>
  import("../components/ProductList/Product.List")
);
const GroupDetail = lazy(() => import("../components/GroupDetail/GroupDetail"));
const AgroProcessorDetail = lazy(() =>
  import("../components/AgroProcessorDetail/AgroProcessorDetail")
);
const ProductDetail = lazy(() =>
  import("../components/ProductDetail/ProductDetail")
);

const FarmerProfile = lazy(() =>
  import("../components/FarmerProfile/FarmerProfile")
);
const EscoProfile = lazy(() => import("../components/EscoProfile/EscoProfile"));
const GroupProfile = lazy(() =>
  import("../components/GroupProfile/GroupProfile")
);
const AgroProcessorProfile = lazy(() =>
  import("../components/AgroProcessorProfile/AgroProcessorProfile")
);
const { FarmerInterestList, GroupInterestList, AgroProcessorInterestList } =
  lazily(() => import("../components/InterestList/InterestList"));
const {
  EscoOfferList,
  FarmerOfferList,
  GroupOfferList,
  AgroProcessorOfferList,
} = lazily(() => import("../components/OfferList/OfferList"));
const {
  FarmerInstallationList,
  EscoInstallationList,
  GroupInstallationList,
  AgroProcessorInstallationList,
} = lazily(() => import("../components/InstallationList/InstallationList"));
const {
  FarmerRecommendationList,
  GroupRecommendationList,
  AgroProcessorRecommendationList,
} = lazily(() => import("../components/RecommendationList/RecommendationList"));

const routes = [
  {
    path: "/",
    element: (
      <SuperAdminRequired>
        <Main />
      </SuperAdminRequired>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/products" />,
      },
      {
        path: "products",
        element: <AllProductList />,
      },
      {
        path: "farmers",
        element: <FarmerList />,
      },
      {
        path: "/farmers/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <FarmerDetail />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <FarmerProfile />,
          },
          {
            path: "interests",
            element: <FarmerInterestList />,
          },
          {
            path: "profile",
            element: <FarmerProfile />,
          },
          {
            path: "installations",
            element: <FarmerInstallationList />,
          },
          {
            path: "offers",
            element: <FarmerOfferList />,
          },
          {
            path: "recommendations",
            element: <FarmerRecommendationList />,
          },
        ],
      },
      {
        path: "escos",
        element: <EscoList />,
      },
      {
        path: "/escos/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <EscoDetail />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <EscoProfile />,
          },
          {
            path: "profile",
            element: <EscoProfile />,
          },
          {
            path: "products",
            element: <EscoProductList />,
          },
          {
            path: "installations",
            element: <EscoInstallationList />,
          },
          {
            path: "offers",
            element: <EscoOfferList />,
          },
        ],
      },
      {
        path: "groups",
        element: <GroupList />,
      },
      {
        path: "/groups/:id",

        element: (
          <Suspense fallback={<Loading />}>
            <GroupDetail />
          </Suspense>
        ),
        children: [
          {
            element: <GroupProfile />,
            index: true,
          },
          {
            path: "profile",
            element: <GroupProfile />,
          },
          {
            path: "interests",
            element: <GroupInterestList />,
          },
          {
            path: "offers",
            element: <GroupOfferList />,
          },
          {
            path: "installations",
            element: <GroupInstallationList />,
          },
          {
            path: "recommendations",
            element: <GroupRecommendationList />,
          },
        ],
      },
      {
        path: "agro-processors",
        element: <AgroProcessorList />,
      },
      {
        path: "/agro-processors/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <AgroProcessorDetail />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <AgroProcessorProfile />,
          },
          {
            path: "interests",
            element: <AgroProcessorInterestList />,
          },
          {
            path: "profile",
            element: <AgroProcessorProfile />,
          },
          {
            path: "installations",
            element: <AgroProcessorInstallationList />,
          },
          {
            path: "offers",
            element: <AgroProcessorOfferList />,
          },
          {
            path: "recommendations",
            element: <AgroProcessorRecommendationList />,
          },
        ],
      },
      {
        path: "products/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <PromoteProductModalContextProvider>
              <LearningModalContextProvider>
                <ProductDetail />
              </LearningModalContextProvider>
            </PromoteProductModalContextProvider>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/farmers/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <FarmerDetail />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
];

const router = createBrowserRouter([...routes], {
  basename: "/farmersescos-web-portal/",
});
export default router;
