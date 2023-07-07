import Box from "@mui/material/Box";
import { useContext } from "react";
import { Wizard, useWizard } from "react-use-wizard";
import { StepCountContext } from "../../pages/SignupWizardSteps";

export const StepCounter = (params) => {
  const stepCount = useContext(StepCountContext);
  const { activeStep } = useWizard();

  return (
    <Wizard>
      <Box
        sx={{
          display: "flex",
          "& .MuiBox-root:nth-of-type(n + 2)": { ml: 1 },
          pb: 1,
        }}
      >
        {new Array(stepCount).fill(null).map((_, i) => (
          <Box
            key={i}
            sx={{
              height: "2px",
              borderRadius: "25px",
              background: (theme) =>
                i <= activeStep
                  ? theme.palette.primary.main
                  : theme.palette.secondary.light,
              flexBasis: `${100 / stepCount!}%`,
            }}
          ></Box>
        ))}
      </Box>
    </Wizard>
  );
};
