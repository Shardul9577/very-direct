import { useSnackbar } from 'notistack';

export function useNotify() {
  const { enqueueSnackbar } = useSnackbar();

  return {
    success: (message) =>
      enqueueSnackbar(message, { variant: 'success' }),
    error: (message) =>
      enqueueSnackbar(message, { variant: 'error' }),
    info: (message) =>
      enqueueSnackbar(message, { variant: 'info' }),
    warning: (message) =>
      enqueueSnackbar(message, { variant: 'warning' }),
  };
}
