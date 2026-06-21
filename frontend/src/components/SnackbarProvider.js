import { SnackbarProvider as NotistackProvider } from 'notistack';

export default function SnackbarProvider({ children }) {
  return (
    <NotistackProvider
      maxSnack={4}
      autoHideDuration={3500}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      preventDuplicate
    >
      {children}
    </NotistackProvider>
  );
}
