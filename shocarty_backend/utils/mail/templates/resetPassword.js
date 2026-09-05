import { ENV } from "../../../configs/Env.js";

const { FRONTEND_URL } = ENV;

export const resetPassword = (token) => {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body>
  <div>
    <div>
   <a href="${FRONTEND_URL}/update-password/${token}">Click here</a>
    </div>
  </div>
</body>
</html>`;
};
