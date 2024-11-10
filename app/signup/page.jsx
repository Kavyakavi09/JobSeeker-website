'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';


const SignupForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const validationSchema = Yup.object({
    Name: Yup.string()
      .min(2, 'Name must be at least 10 characters')
      .max(20, 'Name cannot exceed 70 characters')
      .required('Name is required'),
    Email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    Phone: Yup.string().matches(/^[0-9]{10}$/, "Invalid phone number").required("Phone number is required"),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password cannot exceed 20 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        'Password must contain 1 uppercase, 1 lowercase, 1 special character, and 1 number'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/signin');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign Up</h1>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <Formik
          initialValues={{
            Name: '',
            Email: '',
            Phone: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label htmlFor="Name" className="block text-sm font-medium">Name</label>
              <Field
                type="text"
                id="Name"
                name="Name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="Name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="Email" className="block text-sm font-medium">Email</label>
              <Field
                type="email"
                id="Email"
                name="Email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="Email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="Phone" className="block text-sm font-medium">Phone</label>
              <Field
                type="text"
                id="Phone"
                name="Phone"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="Phone" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </div>
            <Link
                    href={'/signin'}
                    className='d-block text-center mt-5 text-decoration-none'>
                    Have an account? Sign In
            </Link>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignupForm;
