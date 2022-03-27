import React, { useEffect, useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { useHistory } from "react-router";
import { UserTracking } from "../../../trenitalia-bot/src/types";
import ButtonAsLink from "../components/ButtonAsLink";

const SyncedTrains: React.FC = () => {
  const [followed, setFollowed] = useState<UserTracking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    fetch((process.env.REACT_APP_API_URI + "/user-tracking/admin") as string)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setFollowed(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Treni seguiti</h1>
      <h2>Totale seguiti: {followed.length}</h2>
      <Container>
        {isLoading ? "Loading" : <></>}
        {followed.map((elem) => (
          <div>
            <ButtonAsLink
              onClick={() => {
                history.push({
                  pathname: "RiepilogoTreno/train",
                  search: `?trainNum=${elem.name}&startLocationId=${elem.departureLocationId}`,
                });
              }}
            >
              {elem.classification} {elem.name}
            </ButtonAsLink>
            <span>
              {elem.departureLocationName}-{elem.arrivalLocationName}
            </span>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default SyncedTrains;
