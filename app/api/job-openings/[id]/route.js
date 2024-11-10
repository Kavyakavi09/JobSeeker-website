import dbConnect from '@/lib/dbConnect';
import JobPosting from '@/models/jobPosting';

export async function GET(req, { params }) {
    try {
      await dbConnect();
      const job = await JobPosting.findById(params.id);
  
      if (!job || job.isDeleted) {
        return new Response(JSON.stringify({ message: 'Job opening not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify(job), { status: 200 });
    } catch (error) {
      console.error('Error retrieving job posting:', error);
      return new Response(JSON.stringify({ message: 'Failed to fetch job opening' }), { status: 500 });
    }
  }