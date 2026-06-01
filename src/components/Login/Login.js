import {Box, Button, Card, Sheet, Stack, Typography} from "@mui/joy";
import logo from "../../assets/logo.jpg";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PasswordInput from "../common/fields/PasswordInput";
import {useSigninMutation} from "../../services/auth";
import {useLocation, useNavigate} from "react-router";
import {toast} from "react-toastify";
import {Form, Formik} from "formik";
import TextInput from "../common/fields/TextInput";
import {object, string} from "yup";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [signin, {isLoading}] = useSigninMutation();

    return (
        <Sheet
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f4fcf7 0%, #f9f9f6 50%, #f1faf3 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Soft Organic Background Glow Blobs */}
            <Box
                sx={{
                    position: "absolute",
                    top: "10%",
                    right: "15%",
                    width: 450,
                    height: 450,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(76, 175, 80, 0.12) 0%, rgba(76, 175, 80, 0) 70%)",
                    filter: "blur(50px)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "10%",
                    left: "15%",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0) 70%)",
                    filter: "blur(60px)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            <Card
                variant="outlined"
                sx={{
                    p: 4,
                    width: "90%",
                    maxWidth: "420px",
                    borderRadius: "24px",
                    backdropFilter: "blur(20px)",
                    bgcolor: "rgba(255, 255, 255, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01)",
                    zIndex: 10,
                }}
            >
                {/* Logo Capsule */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2.5 }}>
                    <Box
                        sx={{
                            width: 84,
                            height: 84,
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3.5px solid white",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                            bgcolor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={logo}
                            alt="IMEU logo"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                </Box>

                {/* Headers */}
                <Typography
                    level="h3"
                    textColor="neutral.900"
                    sx={{
                        textAlign: "center",
                        fontWeight: "800",
                        letterSpacing: "-0.5px",
                        mb: 0.5,
                    }}
                >
                    Welcome Back
                </Typography>
                <Typography
                    level="body-sm"
                    textColor="neutral.500"
                    sx={{
                        textAlign: "center",
                        fontWeight: "500",
                        mb: 3.5,
                    }}
                >
                    Enter your credentials to access the admin portal
                </Typography>

                <Formik
                    initialValues={{
                        username: "",
                        password: "",
                    }}
                    validationSchema={object({
                        username: string().required("Username is required"),
                        password: string().required("Password is required"),
                    })}
                    onSubmit={async (values) => {
                        try {
                            await signin(values).unwrap();
                            navigate(location.state?.next || "/");
                            toast.success("Successfully signed in");
                        } catch (err) {
                            toast.error(err.message);
                        }
                    }}
                >
                    <Form>
                        <TextInput
                            id="username"
                            label="Username"
                            autoComplete="username"
                            name="username"
                            placeholder="Username"
                            startDecorator={<PersonOutlinedIcon sx={{ color: "neutral.500" }} />}
                            sx={{ padding: 1 }}
                        />
                        <PasswordInput
                            id="current-password"
                            containerSx={{ marginTop: 3 }}
                            name="password"
                            label="Password"
                            autoComplete="current-password"
                            placeholder="Password"
                            startDecorator={<LockOutlinedIcon sx={{ color: "neutral.500" }} />}
                            sx={{ padding: 1 }}
                        />
                        <Stack direction="row" sx={{ marginTop: 3.5, alignItems: "center" }}>
                            <Button
                                variant="plain"
                                color="neutral"
                                size="sm"
                                sx={{
                                    fontWeight: "600",
                                    "&:hover": {
                                        bgcolor: "rgba(0,0,0,0.03)",
                                    },
                                }}
                            >
                                Forgot password?
                            </Button>
                            <Button
                                type="submit"
                                color="success"
                                size="md"
                                sx={{
                                    marginLeft: "auto",
                                    borderRadius: "12px",
                                    fontWeight: "700",
                                    px: 3,
                                    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.15)",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        boxShadow: "0 6px 16px rgba(46, 125, 50, 0.25)",
                                        transform: "translateY(-1px)",
                                    },
                                    "&:active": {
                                        transform: "translateY(1px)",
                                    },
                                }}
                                loading={isLoading}
                                disabled={isLoading}
                                loadingPosition="start"
                            >
                                Sign In
                            </Button>
                        </Stack>
                    </Form>
                </Formik>
            </Card>
        </Sheet>
    );
}
