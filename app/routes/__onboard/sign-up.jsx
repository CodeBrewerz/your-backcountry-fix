import { useNhostAuth } from "@nhost/react-auth";
import { useEffect } from "react";
import { Form, json, redirect, useActionData, useTransition } from "remix";
import { NhostClient } from "@nhost/nhost-js";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { getSession } from "~/utils/session.server";

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

export const action = async ({ request }) => {
  let session = await getSession(request);

  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const name = form.get("name");

  if (typeof email !== "string" || typeof password !== "string") {
    return json(
      {
        errorMessage: `Form not submitted correctly, try again`,
      },
      { status: 400 }
    );
  }

  if (validatePassword(password))
    return json(
      {
        errorMessage: `Passwords must be at least 6 characters long`,
      },
      { status: 400 }
    );

  const nhost = new NhostClient({
    backendUrl: "https://ilomfyseqqwhpqpspjrv.nhost.run",
  });

  const res = await nhost.auth.signUp({
    email,
    password,
    options: {
      displayName: name,
    },
  });

  if (res.error)
    return json({ errorMessage: res.error.message }, { status: 401 });
  else {
    return json(
      { successMessage: "Registration was successfully, you can sign in now!" },
      { status: 200 }
    );
  }
};

export default function SignUp() {
  const { isLoading, isAuthenticated } = useNhostAuth();
  const actionData = useActionData();
  const transition = useTransition();

  const errorInputClassNames =
    "block py-2 w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md";

  const defaultInputClassNames =
    "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md";

  const passwordClassNames =
    "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  const inputClassNames = classNames({
    [errorInputClassNames]: actionData?.errorMessage,
    [defaultInputClassNames]: !actionData?.errorMessage,
  });

  useEffect(() => {}, [isLoading, isAuthenticated, actionData]);
  return (
    <>
      {actionData?.errorMessage && (
        <p className="my-2 text-center text-md text-red-600" id="email-error">
          {`${actionData?.errorMessage} Please try again`}
        </p>
      )}
      {actionData?.successMessage && (
        <p className="my-2 text-center text-md text-green-600" id="success">
          {actionData?.successMessage}
        </p>
      )}
      <Form method="post" className="space-y-6">
        {/* Name Field */}
        <div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name-input"
              required
              className={defaultInputClassNames}
              placeholder="John Doe"
              aria-invalid="true"
              aria-describedby="name-error"
            />
            {/* {actionData?.errorMessage && (
              <div className="absolute mt-4 inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )} */}
          </div>
          {/* {actionData?.errorMessage && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {actionData?.errorMessage}
            </p>
          )} */}
        </div>
        {/* Email Field */}
        <div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email-input"
              required
              className={defaultInputClassNames}
              placeholder="you@example.com"
              aria-invalid="true"
              aria-describedby="email-error"
            />
            {/* {actionData?.errorMessage && (
              <div className="absolute mt-4 inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )} */}
          </div>
          {/* {actionData?.errorMessage && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {actionData?.errorMessage}
            </p>
          )} */}
        </div>
        {/* Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative rounded-md">
            <input
              id="password-input"
              name="password"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              required
              className={defaultInputClassNames}
            />
            {/* {actionData?.errorMessage && (
              <div className="absolute mb-7 inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )} */}
            {/* {actionData?.errorMessage && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {actionData?.errorMessage}
              </p>
            )} */}
          </div>
        </div>

        {/* TODO: Add Forgot Password and remember me */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </a>
          </div>
        </div> */}

        <div>
          <button
            disabled={transition.state === "submitting"}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {transition.state === "submitting" ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </Form>
    </>
  );
}
