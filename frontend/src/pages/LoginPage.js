import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../assets/designlogin.jpg"
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import PropTypes from 'prop-types';


LoginPage.propTypes = {
    role: PropTypes.oneOf(['Admin', 'Student', 'Teacher']).isRequired,
};
const defaultTheme = createTheme();
function LoginPage({ role }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    const [toggle, setToggle] = useState(false)
    const [guestLoader, setGuestLoader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);
    
    const WEB3FORMS_ACCESS_KEY = "2440aa25-9bf8-4042-aff3-acc3779e403e"
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        let fields = {};
    
        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;
    
            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }
    
            fields = { rollNum, studentName, password };
        } else {
            const email = event.target.email.value;
            const password = event.target.password.value;
    
            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }
    
            fields = { email, password };
        }
    
        setLoader(true);
    
        try {
            // Dispatch login action
            dispatch(loginUser(fields, role));
    
            // Email notification logic
            const emailPayload = {
                access_key: "2440aa25-9bf8-4042-aff3-acc3779e403e",
                subject: `${role} Login Attempt`,
                from_name: "Your Application Name",
                from_email: "no-reply@yourapp.com",
                reply_to: "no-reply@yourapp.com",
                message: `A ${role} has logged in. Details:\n${JSON.stringify(fields, null, 2)}`,
            };
    
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(emailPayload),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                console.log("Email notification sent successfully:", result);
            } else {
                console.error("Failed to send email notification:", result.message);
            }
        } catch (error) {
            console.error("Error while sending email notification:", error);
        } finally {
            setLoader(false);
        }
    };
    
    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };

    const guestModeHandler = () => {
        const password = "zxc"

        if (role === "Admin") {
            const email = "yogendra@12"
            const fields = { email, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
        else if (role === "Student") {
            const rollNum = "1"
            const studentName = "Dipesh Awasthi"
            const fields = { rollNum, studentName, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
        else if (role === "Teacher") {
            const email = "tony@12"
            const fields = { email, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            }
            else if (currentRole === 'Student') {
                navigate('/Student/dashboard');
            } else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            }
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
            setGuestLoader(false)
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            {role} Login
                        </Typography>
                        <Typography variant="h7">
                            Welcome back! Please enter your details
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {role === "Student" ? (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="rollNumber"
                                        label="Enter your Roll Number"
                                        name="rollNumber"
                                        autoComplete="off"
                                        type="number"
                                        autoFocus
                                        error={rollNumberError}
                                        helperText={rollNumberError && 'Roll Number is required'}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="studentName"
                                        label="Enter your name"
                                        name="studentName"
                                        autoComplete="name"
                                        autoFocus
                                        error={studentNameError}
                                        helperText={studentNameError && 'Name is required'}
                                        onChange={handleInputChange}
                                    />
                                </>
                            ) : (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter your email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={emailError}
                                    helperText={emailError && 'Email is required'}
                                    onChange={handleInputChange}
                                />
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <StyledLink href="#">
                                    Forgot password?
                                </StyledLink>
                            </Grid>
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                            >
                                {loader ?
                                    <CircularProgress size={24} color="inherit" />
                                    : "Login"}
                            </LightPurpleButton>
                            <Button
                                fullWidth
                                onClick={guestModeHandler}
                                variant="outlined"
                                sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
                            >
                                Login as Guest
                            </Button>
                            {role === "Admin" &&
                                <Grid container>
                                    <Grid>
                                        Don't have an account?
                                    </Grid>
                                    <Grid item sx={{ ml: 2 }}>
                                        <StyledLink to="/Adminregister">
                                            Sign up
                                        </StyledLink>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={guestLoader}
            >
                <CircularProgress color="primary" />
                Please Wait
            </Backdrop>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
}

export default LoginPage

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import bgpic from "../assets/designlogin.jpg"
// import { LightPurpleButton } from '../components/buttonStyles';
// import styled from 'styled-components';
// import Popup from '../components/Popup';

// const defaultTheme = createTheme();

// const LoginPage = ({ role }) => {

//     const navigate = useNavigate();

//     const [toggle, setToggle] = useState(false);
//     const [loader, setLoader] = useState(false);
//     const [showPopup, setShowPopup] = useState(false);
//     const [message, setMessage] = useState("");

//     const [emailError, setEmailError] = useState(false);
//     const [passwordError, setPasswordError] = useState(false);
//     const [rollNumberError, setRollNumberError] = useState(false);
//     const [studentNameError, setStudentNameError] = useState(false);

//     const handleSubmit = (event) => {
//         event.preventDefault();
    
//         // **Added this line to show loader while submitting the form**
//         setLoader(true);
    
//         const formData = {
//             access_key: "2440aa25-9bf8-4042-aff3-acc3779e403e",
//             email: event.target.email?.value || "",
//             password: event.target.password?.value || "",
//             rollNumber: event.target.rollNumber?.value || "",
//             studentName: event.target.studentName?.value || "",
//         };
    
//         fetch("https://api.web3forms.com/submit", {
//             method: "POST",
//             // **Added this header to specify JSON format**
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData), // **Converted FormData to JSON format**
//         })
//             .then(async (response) => {
//                 const result = await response.json();
//                 if (response.ok) {
//                     setMessage("Form submitted successfully!");
//                 } else {
//                     setMessage(result.message || "Form submission failed!");
//                 }
//                 setShowPopup(true);
//             })
//             .catch(() => {
//                 setMessage("Network error. Please try again later.");
//                 setShowPopup(true);
//             })
//             .finally(() => setLoader(false)); // **Loader stops after submission completes**
//     };
    
//     const handleInputChange = (event) => {
//         const { name } = event.target;
//         if (name === 'email') setEmailError(false);
//         if (name === 'password') setPasswordError(false);
//         if (name === 'rollNumber') setRollNumberError(false);
//         if (name === 'studentName') setStudentNameError(false);
//     };

//     return (
//         <ThemeProvider theme={defaultTheme}>
//             <Grid container component="main" sx={{ height: '100vh' }}>
//                 <CssBaseline />
//                 <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//                     <Box
//                         sx={{
//                             my: 8,
//                             mx: 4,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                         }}
//                     >
//                         <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
//                             {role} Login
//                         </Typography>
//                         <Typography variant="h7">
//                             Welcome back! Please enter your details
//                         </Typography>
//                         <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
//                             {role === "Student" ? (
//                                 <>
//                                     <TextField
//                                         margin="normal"
//                                         required
//                                         fullWidth
//                                         id="rollNumber"
//                                         label="Enter your Roll Number"
//                                         name="rollNumber"
//                                         autoComplete="off"
//                                         type="number"
//                                         autoFocus
//                                         error={rollNumberError}
//                                         helperText={rollNumberError && 'Roll Number is required'}
//                                         onChange={handleInputChange}
//                                     />
//                                     <TextField
//                                         margin="normal"
//                                         required
//                                         fullWidth
//                                         id="studentName"
//                                         label="Enter your name"
//                                         name="studentName"
//                                         autoComplete="name"
//                                         autoFocus
//                                         error={studentNameError}
//                                         helperText={studentNameError && 'Name is required'}
//                                         onChange={handleInputChange}
//                                     />
//                                 </>
//                             ) : (
//                                 <TextField
//                                     margin="normal"
//                                     required
//                                     fullWidth
//                                     id="email"
//                                     label="Enter your email"
//                                     name="email"
//                                     autoComplete="email"
//                                     autoFocus
//                                     error={emailError}
//                                     helperText={emailError && 'Email is required'}
//                                     onChange={handleInputChange}
//                                 />
//                             )}
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 name="password"
//                                 label="Password"
//                                 type={toggle ? 'text' : 'password'}
//                                 id="password"
//                                 autoComplete="current-password"
//                                 error={passwordError}
//                                 helperText={passwordError && 'Password is required'}
//                                 onChange={handleInputChange}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setToggle(!toggle)}>
//                                                 {toggle ? (
//                                                     <Visibility />
//                                                 ) : (
//                                                     <VisibilityOff />
//                                                 )}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                             <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
//                                 <FormControlLabel
//                                     control={<Checkbox value="remember" color="primary" />}
//                                     label="Remember me"
//                                 />
//                                 <StyledLink href="#">
//                                     Forgot password?
//                                 </StyledLink>
//                             </Grid>
//                             <LightPurpleButton
//                                 type="submit"
//                                 fullWidth
//                                 variant="contained"
//                                 sx={{ mt: 3 }}
//                             >
//                                 {loader ?
//                                     <CircularProgress size={24} color="inherit" />
//                                     : "Login"}
//                             </LightPurpleButton>
//                         </Box>
//                     </Box>
//                 </Grid>
//                 <Grid
//                     item
//                     xs={false}
//                     sm={4}
//                     md={7}
//                     sx={{
//                         backgroundImage: `url(${bgpic})`,
//                         backgroundRepeat: 'no-repeat',
//                         backgroundColor: (t) =>
//                             t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                     }}
//                 />
//             </Grid>
//             <Backdrop
//                 sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//                 open={loader}
//             >
//                 <CircularProgress color="primary" />
//                 Please Wait
//             </Backdrop>
//             <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
//         </ThemeProvider>
//     );
// }

// export default LoginPage;

// const StyledLink = styled(Link)`
//   margin-top: 9px;
//   text-decoration: none;
//   color: #7f56da;
// `;
