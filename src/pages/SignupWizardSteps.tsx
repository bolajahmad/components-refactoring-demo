import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { createContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useWizard } from "react-use-wizard";

import LoadingButton from "../common/components/LoadingButton";
import { StepCounter } from "../common/components/StepCounter";
import BuildingImageBox from "../common/components/BuildingImageBox";
import VerticalSplitLayout from "../common/components/VerticalSplitLayout";
import { axiosClient } from "../common/utils";

function handleTextValueChanged(e, stateSetter) {
  stateSetter(e.target.value);
}

type StepLayoutProps = {
  title: string;
  subtitle: string;
  isNextEnabled: boolean;
  isLoading: boolean;
  Header?: React.ReactNode;
  onPreviousButtonClicked?: () => void;
  onNextButtonClicked?: () => void;
  nextButtonLabel?: string;
  children?: React.ReactNode;
  rightSection?: React.ReactNode;
  showButtons?: boolean;
};

export default function StepLayout({
  title,
  subtitle,
  showButtons = true,
  isNextEnabled,
  isLoading,
  children,
  rightSection,
  Header,
  onPreviousButtonClicked,
  nextButtonLabel = "Next",
  onNextButtonClicked,
}: StepLayoutProps) {
  const { previousStep, activeStep, nextStep } = useWizard();
  const theme = useTheme();

  return (
    <VerticalSplitLayout rightSection={rightSection}>
      <Box
        sx={{
          mb: 5,
          [theme.breakpoints.down("md")]: {
            display: "none",
          },
        }}
      >
        {Header || <StepCounter />}
      </Box>
      <Typography variant="h4" fontWeight={500}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
        {subtitle}
      </Typography>
      <Box
        sx={{
          mt: 4,
        }}
      >
        {children}
      </Box>
      {showButtons && (
        <Box
          sx={{
            display: "flex",
            mt: 4,
            gap: "12px",
            [theme.breakpoints.down("md")]: {
              mt: "auto",
              justifySelf: "flex-end",
            },
          }}
        >
          {activeStep > 0 && (
            <Button
              variant="outlined"
              onClick={onPreviousButtonClicked || previousStep}
              sx={{ flexBasis: "50%" }}
            >
              Previous
            </Button>
          )}
          <LoadingButton
            variant="contained"
            onClick={onNextButtonClicked || nextStep}
            disabled={!isNextEnabled}
            isLoading={isLoading}
            size="large"
            sx={{
              ml: 2,
              flexBasis: "50%",
              [theme.breakpoints.down("md")]: {
                ml: 0,
                flexBasis: activeStep > 0 ? "50%" : "100%",
              },
            }}
          >
            {nextButtonLabel}
          </LoadingButton>
        </Box>
      )}
      {activeStep === 0 && (
        <Typography
          variant="body1"
          color="text.secondary2"
          sx={{
            mt: 4,
            alignSelf: "flex-start",
            [theme.breakpoints.down("md")]: {
              alignSelf: "center",
            },
          }}
        >
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/users/login"
            variant="body1"
            sx={{ color: (theme) => theme.palette.primary.main }}
          >
            Sign in
          </Link>
        </Typography>
      )}
    </VerticalSplitLayout>
  );
}

export function NameStep({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  subtitle = "Your name will be hidden from brokerages by default",
}) {
  return (
    <StepLayout
      isNextEnabled={firstName && lastName}
      title="What is your name?"
      isLoading={false}
      subtitle={subtitle}
      rightSection={<BuildingImageBox />}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <TextField
          label="First"
          value={firstName}
          onChange={(e) => handleTextValueChanged(e, setFirstName)}
          fullWidth
          autoFocus
        />
        <TextField
          label="Last"
          value={lastName}
          onChange={(e) => handleTextValueChanged(e, setLastName)}
          fullWidth
          sx={{ mt: 3 }}
        />
      </Box>
    </StepLayout>
  );
}

export function ContactInformationStep({
  phone,
  setPhone,
  email,
  setEmail,
  emailError,
  setEmailError,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { nextStep } = useWizard();

  function handleNextButtonClicked() {
    setIsLoading(true);
    axiosClient
      .post("/users/api/signup-email-validator/", { email })
      .then(() => nextStep())
      .catch(({ response: { data } }) => {
        setEmailError(data.email);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <StepLayout
      isNextEnabled={phone && email && !emailError}
      title="Ok, and where can you be contacted?"
      subtitle="Add your contact information"
      rightSection={<BuildingImageBox />}
      isLoading={isLoading}
      onNextButtonClicked={handleNextButtonClicked}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label="Phone Number"
          value={phone}
          onChange={(e) => handleTextValueChanged(e, setPhone)}
          fullWidth
          autoFocus
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          error={!!emailError}
          helperText={emailError}
          onChange={(e) => handleTextValueChanged(e, setEmail)}
          fullWidth
          sx={{ mt: 3 }}
        />
      </Box>
    </StepLayout>
  );
}

export function useNameStepState() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  return { firstName, setFirstName, lastName, setLastName };
}

export function useContactInformationStepState() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  function handleEmailChanged(newValue) {
    setEmail(newValue);
    setEmailError(null);
  }

  return {
    phone,
    setPhone,
    email,
    setEmail: handleEmailChanged,
    emailError,
    setEmailError,
  };
}

export const StepCountContext = createContext(0);
