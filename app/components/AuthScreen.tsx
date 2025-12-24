"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CanvasScene from "./CanvasScene";
import styles from "../login/login.module.css";

type Mode = "login" | "signup" | "forgot";

type AuthScreenProps = {
  initialMode?: Mode;
};

const DEMO_USERNAME = "demo";
const DEMO_EMAIL = "demo@lynkhub.com";
const DEMO_PASSWORD = "Lynk123!";
const REMEMBER_KEY = "lynkhub_remembered_user_v1";
const REMEMBER_PASSWORD_KEY = "lynkhub_remembered_password_v1";

export default function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    if (nextMode === "login") {
      router.replace(pathname);
      return;
    }
    router.replace(`${pathname}?mode=${nextMode}`);
  };

  const loadRemembered = () => {
    if (typeof window === "undefined") return;
    try {
      const value = window.localStorage.getItem(REMEMBER_KEY);
      const savedPassword = window.localStorage.getItem(REMEMBER_PASSWORD_KEY);
      if (value || savedPassword) {
        if (value) {
          setLoginEmail(value);
        }
        if (savedPassword) {
          setLoginPassword(savedPassword);
        }
        setRememberMe(true);
      }
    } catch {
      // Ignore storage errors.
    }
  };

  const saveRemembered = (value: string | null, password: string | null) => {
    if (typeof window === "undefined") return;
    try {
      if (value) {
        window.localStorage.setItem(REMEMBER_KEY, value);
      } else {
        window.localStorage.removeItem(REMEMBER_KEY);
      }
      if (password) {
        window.localStorage.setItem(REMEMBER_PASSWORD_KEY, password);
      } else {
        window.localStorage.removeItem(REMEMBER_PASSWORD_KEY);
      }
    } catch {
      // Ignore storage errors.
    }
  };

  useEffect(() => {
    loadRemembered();
  }, []);

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Please enter your email/username and password.");
      setLoginSuccess(null);
      return;
    }
    const normalized = loginEmail.trim().toLowerCase();
    const validUser = normalized === DEMO_EMAIL || normalized === DEMO_USERNAME;
    const validPassword = loginPassword === DEMO_PASSWORD;
    if (validUser && validPassword) {
      setLoginError(null);
      setLoginSuccess("Login successful. Demo session started.");
      router.push("/dashboard");
      if (rememberMe) {
        saveRemembered(normalized, loginPassword);
      } else {
        saveRemembered(null, null);
      }
      return;
    }
    setLoginSuccess(null);
    setLoginError("Invalid credentials. Please try again.");
  };

  const strength = useMemo(() => {
    let score = 0;
    if (signupPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(signupPassword)) score += 1;
    if (/[0-9]/.test(signupPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(signupPassword)) score += 1;
    return Math.min(score, 4);
  }, [signupPassword]);

  const strengthClass =
    strength <= 1
      ? styles.strengthWeak
      : strength === 2
        ? styles.strengthFair
        : strength === 3
          ? styles.strengthGood
          : styles.strengthStrong;

  return (
    <main className={styles.page}>
      <CanvasScene className={styles.canvasScene} />
      <div className={`${styles.brand} ${styles.topBrand}`}>
        <div className={styles.brandTitle}>LYNKHUB</div>
        <div className={styles.brandSubtitle}>
          Command every mission with confidence.
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.card}>
          {mode === "login" && (
            <>
              <div className={styles.formTitle}>Welcome</div>
              <div className={styles.formSubtitle}>
                Sign in to continue your mission control session.
              </div>
              <form className={styles.form} onSubmit={handleLoginSubmit}>
                <div className={styles.field}>
                  <div className={styles.label}>Email or username</div>
                  <input
                    className={styles.input}
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="name.surname@company.com"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.label}>Password</div>
                  <div className={styles.inputWrap}>
                    <input
                      className={styles.input}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                    />
                    <button
                      className={styles.eyeButton}
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg
                          className={styles.eyeIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg
                          className={styles.eyeIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
                          <path d="M4 4l16 16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className={styles.errorMessage} role="alert" aria-live="polite">
                    {loginError}
                  </div>
                )}
                {loginSuccess && (
                  <div className={styles.successMessage} role="status" aria-live="polite">
                    {loginSuccess}
                  </div>
                )}

                <div className={styles.row}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      name="remember"
                      checked={rememberMe}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setRememberMe(checked);
                        if (!checked) {
                          saveRemembered(null, null);
                        }
                      }}
                    />
                    Remember me
                  </label>
                  <button
                    className={styles.linkButton}
                    type="button"
                    onClick={() => changeMode("forgot")}
                  >
                    Forgot password?
                  </button>
                </div>

                <button className={styles.primaryButton} type="submit">
                  Sign in
                </button>
              </form>

              <div className={styles.footer}>
                <span>You can create a new account.</span>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => changeMode("signup")}
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {mode === "signup" && (
            <>
              <div className={styles.formTitle}>Create account</div>
              <div className={styles.formSubtitle}>
                Get started in minutes with a new workspace.
              </div>
              <form className={styles.form}>
                <div className={styles.field}>
                  <div className={styles.label}>Full name</div>
                  <input
                    className={styles.input}
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Name Surname"
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.label}>Email</div>
                  <input
                    className={styles.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name.surname@company.com"
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.label}>Password</div>
                  <input
                    className={styles.input}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                  />
                  <div className={styles.strengthMeta}>Password strength</div>
                  <div className={styles.strengthTrack} aria-hidden="true">
                    <span className={`${styles.strengthBar} ${strengthClass}`} />
                  </div>
                </div>

                <div className={styles.field}>
                  <div className={styles.label}>Confirm password</div>
                  <input
                    className={styles.input}
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                  />
                </div>

                <button className={styles.primaryButton} type="submit">
                  Create account
                </button>
              </form>

              <div className={styles.footer}>
                <span>Already have an account?</span>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => changeMode("login")}
                >
                  Sign in
                </button>
              </div>
            </>
          )}

          {mode === "forgot" && (
            <>
              <div className={styles.formTitle}>Reset password</div>
              <div className={styles.formSubtitle}>
                Enter your email to receive a reset link.
              </div>
              <form className={styles.form}>
                <div className={styles.field}>
                  <div className={styles.label}>Email</div>
                  <input
                    className={styles.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name.surname@company.com"
                  />
                </div>

                <button className={styles.primaryButton} type="submit">
                  Send reset link
                </button>
              </form>

              <div className={styles.footer}>
                <span>Remembered your password?</span>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => changeMode("login")}
                >
                  Sign in
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <div className={styles.version}>Ops Command Suite v1.0</div>
    </main>
  );
}
