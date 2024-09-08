"use client";
import { Suspense, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import TourUpdateForm from "@/components/tour/tour_update_modal";
import cookie from "js-cookie";
import Loading from "@/app/management/loading";
import "@/styles/tour.css";
import { defaultITourDetailResponse } from "@/utils/defaults";
const DetailTour = (props: any) => {
  const { params } = props;
  const [loading, setLoading] = useState(true);

  const [tour, setTour] = useState<ITourDetailResponse>(
    defaultITourDetailResponse
  );
  const [categorys, setCategorys] = useState<ICategoryResponse[]>([]);
  const [airrlines, setAirlines] = useState<IAirlineResponse[]>([]);

  const fetchTourDetail = async () => {
    const resGetTour = await fetch(
      `http://localhost:8080/api/tour/${params.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
        },
      }
    );

    const tourData = await resGetTour.json();
    const tour: ITourDetailResponse = tourData.result;
    setTour(tour);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch("http://localhost:8080/api/category", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
        },
      });
      const data = await res.json();
      const categorys: ICategoryResponse[] = data.result;
      setCategorys(categorys);
    };
    const fetchAirline = async () => {
      const res = await fetch("http://localhost:8080/api/airline", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
        },
      });
      const data = await res.json();
      const airline: IAirlineResponse[] = data.result;
      setAirlines(airline);
    };

    const fetchData = async () => {
      await fetchTourDetail();
      await fetchCategory();
      await fetchAirline();
      setLoading(false);
    };
    fetchData();
  }, []);

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
              airlines={airrlines}
              categorys={categorys}
              fetchTour={fetchTourDetail}
            />
        </Suspense>
      </Container>
    </>
  );
};

export default DetailTour;
