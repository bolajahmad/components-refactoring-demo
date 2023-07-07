import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Wizard } from "react-use-wizard";

import BuildingImageBox from "../common/components/BuildingImageBox";
import StepLayout, {
  ContactInformationStep,
  NameStep,
  StepCountContext,
  useContactInformationStepState,
  useNameStepState,
} from "./SignupWizardSteps";
import { axiosClient, getFileExtension } from "../common/utils";

export default function BrokerageSignup() {
  const { firstName, setFirstName, lastName, setLastName } = useNameStepState();
  const { email, setEmail, phone, setPhone, emailError, setEmailError } =
    useContactInformationStepState();
  const [searchQuery, setSearchQuery] = useState("");
  const [brokerages, setBrokerages] = useState([]);
  const [isLoadingBrokerages, setIsLoadingBrokerages] = useState(false);
  const [currentBrokeragePage, setCurrentBrokeragePage] = useState(1);
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isSubmittingSignUp, setIsSubmittingSignUp] = useState(false);
  const [selectedBrokerage, setSelectedBrokerage] = useState(null);
  const isCreatingNewBrokerage = selectedBrokerage === null;

  const navigate = useNavigate();

  const PAGE_SIZE = 50;
  const nextBrokeragePageResultCount = Math.min(
    totalResultsCount - currentBrokeragePage * PAGE_SIZE,
    PAGE_SIZE
  );

  function handleSelectedFileChanged(file) {
    setSelectedFile(file);
  }

  function handleFileCleared() {
    setSelectedFile(null);
  }

  function handleFinishSignupButtonClicked() {
    setIsSubmittingSignUp(true);
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("phone", phone);
    formData.append("email", email);
    if (selectedBrokerage) {
      formData.append("selected_brokerage", selectedBrokerage);
    }
    formData.append("verification_document", selectedFile);
    axiosClient
      .post("/customers/api/signup/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => navigate("/users/signup/success/"))
      .finally(() => setIsSubmittingSignUp(false));
  }

  useEffect(
    () => {
      setIsLoadingBrokerages(true);
      axiosClient
        .get("/customers/api/search-brokerages/", {
          params: { q: searchQuery, page: currentBrokeragePage },
        })
        .then(({ data }) => {
          let newBrokerages = data.results;
          if (currentBrokeragePage > 1) {
            newBrokerages = brokerages.concat(newBrokerages);
          }
          setBrokerages(newBrokerages);
          setTotalResultsCount(data.count);
        })
        .finally(() => setIsLoadingBrokerages(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, currentBrokeragePage]
  );

  return (
    <StepCountContext.Provider value={4}>
      <Wizard>
        <NameStep
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          subtitle=""
        />
        <ContactInformationStep
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          setEmailError={setEmailError}
          phone={phone}
          setPhone={setPhone}
        />
        <VerifyOwnershipStep
          isCreatingNewBrokerage={isCreatingNewBrokerage}
          onFileDrop={handleSelectedFileChanged}
          onClearFile={handleFileCleared}
          filename={selectedFile && selectedFile.name}
          isLoading={isSubmittingSignUp}
          onFinishButtonClicked={handleFinishSignupButtonClicked}
        />
      </Wizard>
    </StepCountContext.Provider>
  );
}

function VerifyOwnershipStep({
  onFileDrop,
  onClearFile,
  filename,
  isCreatingNewBrokerage,
  onFinishButtonClicked,
  isLoading,
}) {
  const FIFTY_MB = 50 * 1024 * 1024;
  const handleFileDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.size > FIFTY_MB) {
      alert("File is too large > 50MB");
    } else {
      onFileDrop(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
  });

  const AVATAR_SIZE = 48;

  return (
    <StepLayout
      title="Verify your ownership"
      subtitle={`
        Before you can ${
          isCreatingNewBrokerage ? "create" : "claim"
        } this brokerage please upload a file that proves your ownership
        (any invoice or bill marking your name and the address of the brokerage).
      `}
      isNextEnabled={!!filename}
      rightSection={<BuildingImageBox />}
      nextButtonLabel="Finish"
      isLoading={isLoading}
      onNextButtonClicked={onFinishButtonClicked}
    >
      {filename ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#F5F6FA",
            width: "100%",
            borderRadius: "4px",
            p: 4,
            mt: 4,
          }}
        >
          <IconButton
            size="small"
            sx={{ alignSelf: "flex-end" }}
            onClick={onClearFile}
          >
            <CloseIcon />
          </IconButton>
          <Avatar
            sx={{
              width: `${AVATAR_SIZE}px`,
              height: `${AVATAR_SIZE}px`,
              background: "#e8eaf2",
            }}
          >
            <AttachFileOutlinedIcon
              sx={{ color: "text.secondary2", transform: "rotate(45deg)" }}
            />
          </Avatar>
          <Typography variant="caption" sx={{ mt: 2 }}>
            {filename}
          </Typography>
          <Typography variant="subtitle2">
            {getFileExtension(filename).toUpperCase()}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
            p: 4,
            border: (theme) =>
              `2px dashed ${
                isDragActive
                  ? theme.palette.primary.light
                  : theme.palette.primary.main
              }`,
            borderRadius: "6px",
            width: "100%",
          }}
          {...getRootProps()}
        >
          <Avatar
            sx={{
              width: `${AVATAR_SIZE}px`,
              height: `${AVATAR_SIZE}px`,
              backgroundColor: (theme) => theme.palette.primary.light,
            }}
          >
            <AttachFileOutlinedIcon
              color="primary"
              sx={{ transform: "rotate(45deg)" }}
            />
          </Avatar>
          <Typography variant="caption" sx={{ mt: 2 }}>
            Drag and drop a file or browse
          </Typography>
          <Typography variant="subtitle2">Max 50mb file</Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            Browse a file
          </Button>
          <input {...getInputProps()} />
        </Box>
      )}
    </StepLayout>
  );
}
