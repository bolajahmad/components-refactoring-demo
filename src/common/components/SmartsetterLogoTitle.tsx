import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

import Logo from "../../assets/images/logo.png";

export default function SmartsetterLogoTitle() {
  return (
    <Link
      component={RouterLink}
      to="/"
      color="inherit"
      underline="none"
      sx={{ display: "flex", alignItems: "center" }}
    >
      <Avatar
        src={Logo}
        alt="smartsetter logo"
        variant="rounded"
        sx={{ borderRadius: "7px" }}
      />
      <Typography
        variant="h6"
        sx={{
          fontSize: "1.5rem",
          ml: 2,
          fontWeight: 600,
        }}
      >
        smartsetter
      </Typography>
    </Link>
  );
}
