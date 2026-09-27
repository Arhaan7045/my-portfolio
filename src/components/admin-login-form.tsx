"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setErrorMessage("The email or password is incorrect.");
      setIsSubmitting(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setErrorMessage("This account is not authorized for the admin panel.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form
      className="admin-login-form"
      onSubmit={handleSubmit}
      autoComplete="off"
      data-lpignore="true"
      data-1p-ignore="true"
    >
      <label>
        <span>Email address</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <label>
        <span>Password</span>
        <div className="admin-password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="admin-passcode"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-bwignore="true"
            data-dashlane-ignore="true"
            data-form-type="other"
            spellCheck={false}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
          <button
            className="admin-password-toggle"
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            <span className="admin-eye-icon" aria-hidden="true">
              <span />
            </span>
            <span>{showPassword ? "HIDE" : "SHOW"}</span>
          </button>
        </div>
      </label>

      {errorMessage ? (
        <p className="admin-login-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button className="admin-login-submit" type="submit" disabled={isSubmitting}>
        <span>{isSubmitting ? "VERIFYING..." : "SIGN IN"}</span>
        <span className="admin-submit-arrow" aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
