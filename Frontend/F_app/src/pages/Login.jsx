import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuthLogic } from "../hooks/useAuthLogic";

const Login = () => {
  const {
    verifyingPin,
    loadingAction,
    pinVerified,
    setPinVerified,
    verifyPin,
    login,
    sendOtp,
    verifyOtp,
    resetSecret,
  } = useAuthLogic();

  const [formData, setFormData] = useState({
    officialEmail: "",
    password: "",
  });

  const [role, setRole] = useState("");
  const [pin, setPin] = useState("");

  const [forgotPinMode, setForgotPinMode] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const [forgotStep, setForgotStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newSecret, setNewSecret] = useState("");

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPin("");
    setPinVerified(false);
    resetForgotModes();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForgotModes = () => {
    setForgotPinMode(false);
    setForgotPasswordMode(false);
    setForgotStep(1);
    setOtp("");
    setNewSecret("");
  };

  const getEndpointBase = () =>
    forgotPinMode ? "forgot-pin" : "forgot-password";

  
  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    if (!formData.officialEmail) {
      alert("Please enter email");
      return;
    }

    if (!formData.password) {
      alert("Please enter password");
      return;
    }

    login(role, formData);
  };

  const handleVerifyPin = () => {
    if (!role) {
      alert("Please select a role");
      return;
    }

    if (!formData.officialEmail) {
      alert("Please enter email first");
      return;
    }

    if (!pin) {
      alert("Please enter PIN");
      return;
    }

    verifyPin(role, formData.officialEmail, pin, () => setPin(""));
  };

  const handleSendOtp = () => {
    if (!role) {
      alert("Please select a role");
      return;
    }

    if (!formData.officialEmail) {
      alert("Please enter email");
      return;
    }

    sendOtp(
      getEndpointBase(),
      role,
      formData.officialEmail,
      () => setForgotStep(2)
    );
  };

  const handleResetSubmit = () => {
    const payload = {
      role,
      email: formData.officialEmail,
      otp,
      newSecret,
    };

    if (forgotPinMode) {wha
      payload.newPin = newSecret;
    }

    if (forgotPasswordMode) {
      payload.newPassword = newSecret;
    }

    resetSecret(getEndpointBase(), payload, resetForgotModes);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              {forgotPinMode
                ? "Reset PIN"
                : forgotPasswordMode
                ? "Reset Password"
                : "Login"}
            </h1>
          </div>

          {!forgotPinMode && !forgotPasswordMode ? (
            <>
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Role */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Login As
                  </label>

                  <select
                    value={role}
                    onChange={handleRoleChange}
                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 text-white rounded-xl"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>

                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="officialEmail"
                    placeholder="Enter your email"
                    value={formData.officialEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 text-white rounded-xl"
                  />
                </div>

                {/* PIN */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="block text-slate-300 font-medium">
                      Security PIN
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotPinMode(true);
                        setForgotPasswordMode(false);
                      }}
                      className="text-sm text-cyan-400"
                    >
                      Forgot PIN?
                    </button>
                  </div>

                  <input
                    type="password"
                    placeholder="Enter Security PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 text-white rounded-xl"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyPin}
                    disabled={pinVerified || verifyingPin}
                    className={`w-full py-3 rounded-xl font-semibold text-white ${
                      pinVerified
                        ? "bg-emerald-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600"
                    }`}
                  >
                    {verifyingPin
                      ? "Verifying..."
                      : pinVerified
                      ? "✓ PIN Verified"
                      : "Verify PIN"}
                  </button>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-slate-300 font-medium">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(true);
                        setForgotPinMode(false);
                      }}
                      className="text-sm text-violet-400"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!pinVerified}
                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 text-white rounded-xl disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!pinVerified || loadingAction}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 disabled:opacity-50"
                >
                  {loadingAction ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-400">
                  Apply as Organization / College?{" "}
                  <Link
                    to="/org-apply"
                    className="text-violet-400 font-semibold"
                  >
                    Apply Here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              {/* Email */}
              <input
                type="email"
                placeholder="Enter your registered email"
                value={formData.officialEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    officialEmail: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 text-white rounded-xl"
              />

              {forgotStep === 1 && (
                <button
                  onClick={handleSendOtp}
                  disabled={loadingAction}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600"
                >
                  {loadingAction ? "Sending..." : "Send Verification OTP"}
                </button>
              )}

              {forgotStep === 2 && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 text-white rounded-xl"
                  />

                  <button
                    onClick={() =>
                      verifyOtp(
                        getEndpointBase(),
                        role,
                        formData.officialEmail,
                        otp,
                        () => setForgotStep(3)
                      )
                    }
                    disabled={loadingAction}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-emerald-600"
                  >
                    {loadingAction ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

              {forgotStep === 3 && (
                <>
                  <input
                    type="password"
                    placeholder={
                      forgotPinMode
                        ? "Enter New PIN"
                        : "Enter New Password"
                    }
                    value={newSecret}
                    onChange={(e) => setNewSecret(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 text-white rounded-xl"
                  />

                  <button
                    onClick={handleResetSubmit}
                    disabled={loadingAction}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600"
                  >
                    {loadingAction ? "Saving..." : "Save"}
                  </button>
                </>
              )}

              <button
                onClick={resetForgotModes}
                className="w-full py-2 text-slate-400 hover:text-white"
              >
                Cancel and Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;