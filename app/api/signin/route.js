import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function POST(req) {
  try {
    const { Email, password } = await req.json();

    // Connect to the database
    await dbConnect();

    // Validate input
    if (!Email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ Email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, Email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return token to client
    return new Response(
      JSON.stringify({ message: 'Login successful', token,user }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
