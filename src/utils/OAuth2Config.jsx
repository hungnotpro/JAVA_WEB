const googleAuthUrl = 'http://localhost:8080/api/oauth2/authorization/google';

export const redirectToGoogleLogin = () => {
  window.location.href = googleAuthUrl;
};