import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import SmartsetterLogoTitle from "./SmartsetterLogoTitle";

type LayoutProps = {
  children?: React.ReactNode;
  rightSection?: React.ReactNode;
};

const VerticalSplitLayout: React.FC<LayoutProps> = ({
  children,
  rightSection,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <VerticalSplitLayoutBox>
      {isMobile ? (
        <>
          <SmartsetterLogoTitleLayout />
          <ImageSectionBox>{rightSection}</ImageSectionBox>
          <ContentSection>{children}</ContentSection>
        </>
      ) : (
        <>
          <ContentSection>{children}</ContentSection>
          <ImageSectionBox>{rightSection}</ImageSectionBox>
        </>
      )}
    </VerticalSplitLayoutBox>
  );
};

type ContentSectionProps = {
  children?: React.ReactNode;
};
function ContentSection({ children }: ContentSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={({ breakpoints }) => ({
        display: "flex",
        flexDirection: "column",
        flexBasis: "50%",
        py: 4,
        px: 12,
        [breakpoints.down("sm")]: {
          p: 2,
          flex: 1,
          mb: 2,
        },
      })}
    >
      {!isMobile && <SmartsetterLogoTitleLayout />}
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          [theme.breakpoints.down("md")]: {
            width: "100%",
            mt: 0,
            height: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 4,
            [theme.breakpoints.down("md")]: {
              mt: 2,
              // height: "40vh",
              height: "100%",
            },
            [theme.breakpoints.down("sm")]: {
              mt: 2,
              // height: "50vh",
              height: "100%",
            },
          }}
        >
          {children}
        </Box>
      </Box>
      <Box sx={{ p: 2 }} />
    </Box>
  );
}

function SmartsetterLogoTitleLayout() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down("md")]: {
          p: 4,
        },
        [theme.breakpoints.down("sm")]: {
          p: 2,
        },
      }}
    >
      <SmartsetterLogoTitle />
    </Box>
  );
}

export const VerticalSplitLayoutBox = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100vw",
  height: "100vh",
  position: "relative",
  overflow: "auto",
  backgroundColor: "#e9e9e9",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

export const ImageSectionBox = styled(Box)(({ theme }) => ({
  flexBasis: "50%",
  position: "sticky",
  top: "0px",
  height: "min(100vh, 100%)",
  [theme.breakpoints.down("md")]: {
    position: "relative",
    flexBasis: 1,
  },
  [theme.breakpoints.down("sm")]: {
    minHeight: "200px",
  },
}));

export default VerticalSplitLayout;
