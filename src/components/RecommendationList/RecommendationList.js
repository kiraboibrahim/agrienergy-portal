import { useParams } from "react-router";
import { useGetFarmerRecommendationsQuery } from "../../services/farmer";
import Loading from "../common/utils/Loading";
import ProductList from "../ProductList/Product.List";
import Error from "../common/utils/Error";
import { useGetGroupRecommendationsQuery } from "../../services/group";
import { useGetAgroProcessorRecommendationsQuery } from "../../services/agroProcessor";

export function FarmerRecommendationList() {
  const { id: farmerId } = useParams();
  const {
    data: recommendations,
    isFetching,
    error,
  } = useGetFarmerRecommendationsQuery({ farmerId });
  return (
    <RecommendationList
      recommendations={recommendations}
      error={error}
      isFetching={isFetching}
    />
  );
}

export function GroupRecommendationList() {
  const { id: groupId } = useParams();
  const {
    data: recommendations,
    isFetching,
    error,
  } = useGetGroupRecommendationsQuery({ groupId });
  return (
    <RecommendationList
      recommendations={recommendations}
      error={error}
      isFetching={isFetching}
    />
  );
}
export function AgroProcessorRecommendationList() {
  const { id: agroProcessorId } = useParams();
  const {
    data: recommendations,
    isFetching,
    error,
  } = useGetAgroProcessorRecommendationsQuery({ agroProcessorId });
  return (
    <RecommendationList
      recommendations={recommendations}
      error={error}
      isFetching={isFetching}
    />
  );
}

function RecommendationList({
  recommendations,
  error = null,
  isFetching = false,
}) {
  if (isFetching) {
    return <Loading />;
  }
  if (!!error) {
    return <Error error={error} />;
  }

  return (
    <ProductList
      products={{ data: recommendations.map(({ product }) => product) }}
    />
  );
}
