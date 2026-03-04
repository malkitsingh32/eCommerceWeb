interface SnackbarData {
  title: string;
  message: string;
  action?: string;
  type: 'success' | 'error' |  'info';
}