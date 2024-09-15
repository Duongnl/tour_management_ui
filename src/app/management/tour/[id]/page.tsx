"use client";
import { Suspense, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import TourUpdateForm from "@/components/tour/tour_update_form";
import Loading from "@/app/management/loading";
import "@/styles/tour.css";
import { defaultITourDetailResponse } from "@/utils/defaults";
import { fetchGetAirlines, fetchGetCategories, fetchGetTour } from "@/utils/serviceApiClient";
const DetailTour = (props: any) => {
  const { params } = props;
  const [loading, setLoading] = useState(true);

  const [tour, setTour] = useState<ITourDetailResponse>(
    defaultITourDetailResponse
  );
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);
  const [airlines, setAirlines] = useState<IAirlineResponse[]>([]);


  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        setCategories(await fetchGetCategories(1));
        setAirlines(await fetchGetAirlines(1));
        setTour(await fetchGetTour(params.id))
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [params.id]);

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Container className="ctn-tour">
        <Suspense>
            <h4>Chi tiết Tour</h4>
            <TourUpdateForm
              tour={tour}
              airlines={airlines}
              categories={categories}
              fetchTour={()=>fetchGetTour(params.id)}
            />
        </Suspense>
      </Container>
    </>
  );
};

export default DetailTour;
