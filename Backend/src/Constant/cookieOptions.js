export const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};