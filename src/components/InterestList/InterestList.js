import { useParams } from "react-router-dom";
import { useGetFarmerFavoriteProductsQuery } from "../../services/farmer";
import { useState } from "react";
import Loading from "../common/utils/Loading";
import Empty from "../common/utils/Empty";
import Error from "../common/utils/Error";
import { ProductItem } from "../ProductList/Product.List";
import PaginatedGridList from "../common/layouts/PaginatedGridList";
import { useGetGroupFavoriteProductsQuery } from "../../services/group";
import { useGetAgroProcessorFavoritesQuery } from "../../services/agroProcessor";

function InterestItem({ interest: { product } }) {
  return <ProductItem product={product} />;
}

export function FarmerInterestList() {
  const { id: farmerId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: interests,
    error,
    isLoading,
    isFetching,
  } = useGetFarmerFavoriteProductsQuery({ farmerId, page });

  return (
    <InterestList
      interests={interests}
      error={error}
      isLoading={isLoading}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}

export function GroupInterestList() {
  const { id: groupId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: interests,
    error,
    isLoading,
    isFetching,
  } = useGetGroupFavoriteProductsQuery({ groupId, page });

  return (
    <InterestList
      interests={interests}
      error={error}
      isLoading={isLoading}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}
export function AgroProcessorInterestList() {
  const { id: agroProcessorId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: interests,
    error,
    isLoading,
    isFetching,
  } = useGetAgroProcessorFavoritesQuery({ agroProcessorId, page });

  return (
    <InterestList
      interests={interests}
      error={error}
      isLoading={isLoading}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}

function InterestList({
  interests,
  error = null,
  isLoading = false,
  isFetching = false,
  onSelectPage = (page) => page,
}) {
  if (isLoading) {
    return <Loading />;
  }
  if (!!error) {
    return <Error error={error} />;
  }
  return (
    <>
      <PaginatedGridList
        data={interests}
        renderItem={(item) => <InterestItem interest={item} />}
        renderEmpty={() => <Empty>No interests found</Empty>}
        onSelectPage={onSelectPage}
        isFetching={isFetching}
      />
    </>
  );
}
