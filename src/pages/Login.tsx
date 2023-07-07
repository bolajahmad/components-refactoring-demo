import Link from "@mui/material/Link";
import { TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import LoadingButton from "../common/components/LoadingButton";
import { axiosClient } from "../common/utils";
import VerticalSplitLayout from "../common/components/VerticalSplitLayout";
import BuildingImageBox from "../common/components/BuildingImageBox";

export default function Login() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useTheme();

  function handleEmailChanged(e) {
    setEmail(e.target.value);
    setEmailError(null);
  }

  function handlePasswordChanged(e) {
    setPassword(e.target.value);
    setEmailError(null);
  }

  function handleLogInButtonClicked() {
    setIsLoading(true);
    axiosClient
      .post("/users/api/login/", {
        email,
        password,
      })
      .then(({ data }) => {
        setEmailError(null);
        // dispatch(storeLoginData(data));
      })
      .catch(({ response: { data } }) => {
        if (data.email) {
          setEmailError(data.email);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // useEffect(() => {
  //   dispatch(retrieveUserProfile());
  // }, []);

  return (
    <VerticalSplitLayout rightSection={<BuildingImageBox />}>
      <Typography variant="h4">Welcome to SmartSetter</Typography>
      <Typography variant="body1" color="text.secondary2" sx={{ mt: 1 }}>
        Join thousands of agents and find the perfect brokerage match!
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        error={!!emailError}
        helperText={emailError}
        sx={{ mt: 4 }}
        onChange={handleEmailChanged}
        autoFocus
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        required
        sx={{ mt: 2 }}
        onChange={handlePasswordChanged}
      />
      <Link
        component={RouterLink}
        to="/users/forgot-password"
        variant="body1"
        sx={{
          color: (theme) => theme.palette.primary.main,
          fontSize: "0.8rem",
          alignSelf: "flex-end",
          mt: 1,
        }}
      >
        Forgot my password
      </Link>
      <LoadingButton
        variant="contained"
        disabled={!email || !password}
        isLoading={isLoading}
        onClick={handleLogInButtonClicked}
        sx={{
          mt: 2,
          alignSelf: "flex-start",
          minWidth: "10em",
          [theme.breakpoints.down("sm")]: {
            alignSelf: "center",
            width: "100%",
          },
        }}
        size="large"
      >
        Log in
      </LoadingButton>
      <Typography variant="body1" color="text.secondary2" sx={{ mt: 4 }}>
        Don't have an account yet?{" "}
        <Link
          component={RouterLink}
          to="/users/signup/select-type/"
          variant="body1"
          sx={{ color: (theme) => theme.palette.primary.main }}
        >
          Sign up
        </Link>
      </Typography>
    </VerticalSplitLayout>
  );
}
