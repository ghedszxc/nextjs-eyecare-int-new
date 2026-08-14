"use client";

import Image from "next/image";
import React, { useActionState } from "react";

import Form from "next/form";

import "./Login.module.css";
import { login } from "@/lib/server-actions";
import { useSearchParams } from "next/navigation";

import styles from "./Login.module.css";

export const LoginForm = () => {
  const searchParams = useSearchParams();

  const loginWithParams = login.bind(
    null,
    (searchParams.get("redirectTo") as string) || null,
  );

  const [state, formAction, pending] = useActionState(
    loginWithParams,
    undefined,
  );

  const parsedState = state ? JSON.parse(state) : undefined;

  return (
    <div className={styles["bg-wrapper"]}>
      <div className={styles.container}>
        <div className={styles["content-wrapper"]}>
          <header>
            <Image
              src={"/images/elec-all-white-png-data.png"}
              alt="logo"
              width={305}
              height={65}
              unoptimized
            />
          </header>
          <div className={styles["form-wrapper"]}>
            <h1 className={styles["form-title"]}>Login</h1>

            {parsedState && !parsedState.success && !pending && (
              <div className={styles["form-error"]}>Login failed</div>
            )}

            <Form action={formAction} className={styles["form"]}>
              <div className={styles["field-wrapper"]}>
                <label htmlFor="userId" className={styles["field-label"]}>
                  User Id
                </label>
                <input
                  id="userId"
                  name="username"
                  type="text"
                  placeholder="User Id"
                  className={styles["field-input"]}
                  disabled={pending}
                />
              </div>

              <div className={styles["field-wrapper"]}>
                <label htmlFor="password" className={styles["field-label"]}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={styles["field-input"]}
                  disabled={pending}
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className={styles["submit-button"]}
              >
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
