import AuthScreen from "../components/AuthScreen";

type Mode = "login" | "signup" | "forgot";

type LoginPageProps = {
  searchParams?: {
    mode?: string | string[];
  };
};

const normalizeMode = (mode?: string | string[]): Mode => {
  if (Array.isArray(mode)) {
    return normalizeMode(mode[0]);
  }
  if (mode === "signup" || mode === "forgot") {
    return mode;
  }
  return "login";
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return <AuthScreen initialMode={normalizeMode(searchParams?.mode)} />;
}
