import { Button, Container, Row } from "react-bootstrap";
import "@/styles/profile.css";
import { fetchGetAccount } from "@/utils/serviceApiServer";
import ProfileModal from "@/components/account/profile_modal";
import { defaultIGetAccountResponse } from "@/utils/defaults";

const Profile = async () => {
  let account: IGetAccountResponse = defaultIGetAccountResponse;
  try {
    account = await fetchGetAccount();
  } catch (error) {
    console.error(error);
  }

  if (account)
    return (
      <>
        <Container className="ctn-profile">
          <Row>
            <ProfileModal account={account} />
          </Row>
        </Container>
      </>
    );
  else return <div>Error fetching data</div>;
};

export default Profile;
