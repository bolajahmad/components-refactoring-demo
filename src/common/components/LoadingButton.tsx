import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  isLoading: boolean;
} & React.ComponentProps<typeof Button>;
const LoadingButton: React.FC<Props> = ({
  disabled,
  isLoading,
  onClick,
  sx,
  children,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={16} /> : null}
      onClick={onClick}
      sx={sx}
      {...props}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;
