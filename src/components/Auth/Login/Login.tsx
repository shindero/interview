import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Routes } from "../../../constants";
import login from "../../../services/login";
import ErrorBlock from "../../ErrorBlock";
import LoadingScreen from "../../LoadingScreen";

import "./login-style.scss";

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [validForm, setValidForm] = useState({ errors: [] });
  const [loading, setLoading] = useState(false);
  const _isMounted = useRef(true);

  /**
 * Form for user login
  Check already unmounted component for the next treatment of async response (avoiding memory leaks)
 */
  useEffect(() => {
    return () => {
      _isMounted.current = false; //
    };
  }, []);

  const handleValidation = () => {
    let user = username;
    let pass = password;
    let errors = [];
    let isValid = true;
    if (!user) {
      errors.push("Username cannot be empty");
      isValid = false;
    }
    if (!pass) {
      errors.push("Password cannot be empty");
      isValid = false;
    }
    setValidForm({ errors: errors });

    return isValid;
  };
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      if (handleValidation()) {
        setValidForm({ errors: [] });
        await login(username, password);
        history.push(Routes.Users);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handleChange = () => {};

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="text-center">Mygom.tech</h1>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          type="text"
          className="input mt-52px"
          aria-label="username"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
          className="input mt-24px"
          aria-label="password"
        />
        <ErrorBlock error={errorMessage} />

        {validForm.errors
          ? validForm.errors.map((error) => (
              <div className="validation-errors">
                <span className="validation-error">{error}</span>
              </div>
            ))
          : ""}
        {loading ? (
          <LoadingScreen />
        ) : (
          <button type="submit" className="button mt-24px">
            Login
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
