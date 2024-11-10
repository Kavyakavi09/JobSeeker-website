import { NextResponse } from 'next/server';
import JobApplication from '@/models/jobApplication';
import JobOpening from '@/models/jobPosting';
import dbConnect from '@/lib/dbConnect';

export async function POST(request) {
  try {
    const { name, qualification, passedOutYear, experience, resume, jobId, email, phone } = await request.json();

    // Validate required fields
    if (!name || !qualification || !passedOutYear || !experience || !resume || !jobId || !email || !phone) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Check if the job exists
    const job = await JobOpening.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: 'Job opening not found.' }, { status: 404 });
    }

    // Create a new job application
    const newApplication = new JobApplication({
      name,
      qualification,
      passedOutYear,
      experience,
      resume,
      jobId,
      email,
      phone,
    });

    // Save the application to the database
    await newApplication.save();

    return NextResponse.json({ message: 'Job application submitted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error applying for job:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
