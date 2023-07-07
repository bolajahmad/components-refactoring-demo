import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import ImageBox from "../../assets/images/building.webp";

const BuildingImageBox = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${ImageBox})`,
  backgroundSize: "cover",
  backgroundColor: "pink",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "100%",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    height: "400px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "200px",
  },
}));

export default BuildingImageBox;
