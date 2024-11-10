import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function POST(req) {
  try {
    // Parse request body
    const { Name, Email, password, Phone, confirmPassword } = await req.json();

    // Connect to the database
    await dbConnect();

    if (!Name || !Email || !password || !Phone || !confirmPassword) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return new Response(JSON.stringify({ message: 'Passwords do not match' }), { status: 400 });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
    if (!passwordRegex.test(password)) {
      return new Response(
        JSON.stringify({
          message: 'Password must contain 1 uppercase, 1 lowercase, 1 special character, and 1 number',
        }),
        { status: 400 }
      );
    }

    // Check if business email already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already in use' }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      Name,
      Email,
      Phone,
      passwordHash: hashedPassword,
    });

    await user.save();

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
