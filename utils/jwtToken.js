export const generateToken = (user, message, statusCode, res) => {
  try {
    const token = user.generateJsonWebToken();
    const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

    res
      .status(statusCode)
      .cookie(cookieName, token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
        secure:true,
        sameSite:"None"
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({
      success: false,
      message: "Token generation failed.",
    });
  }
};
