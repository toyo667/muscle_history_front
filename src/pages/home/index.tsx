import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { RequiredAuth } from "../../utils/requiredAuth";

const Home = () => {
  return (
    <Box>
      <Box>
        <Link to="/workout">start workout</Link>
      </Box>
      <Box>
        <Link to="/history">show History</Link>
      </Box>
    </Box>
  );
};

export default RequiredAuth(Home);
