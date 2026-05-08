import mongoose from "mongoose";
import { College, Course, Review } from "@workspace/db";

const collegesData = [
  {
    name: "Indian Institute of Technology Bombay",
    location: "Mumbai",
    state: "Maharashtra",
    type: "Public",
    rating: 4.8,
    totalFees: 800000,
    placementPercentage: 98,
    avgPackage: 2100000,
    established: 1958,
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 65,
    topCourses: ["B.Tech", "M.Tech", "MBA", "PhD"],
    nirf: 3,
    description: "IIT Bombay is one of India's premier engineering institutions, known for cutting-edge research and excellent placement records. The campus spans 550 acres in Powai, Mumbai and is home to over 10,000 students.",
    website: "https://www.iitb.ac.in",
    accreditation: "NAAC A++",
    totalStudents: 10000,
    facultyCount: 600,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["JEE Advanced", "GATE", "CAT"],
  },
  {
    name: "Indian Institute of Technology Delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Public",
    rating: 4.9,
    totalFees: 850000,
    placementPercentage: 98,
    avgPackage: 2400000,
    established: 1961,
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 70,
    topCourses: ["B.Tech", "M.Tech", "MBA", "PhD"],
    nirf: 2,
    description: "IIT Delhi is a leading technical university located in the Hauz Khas area of New Delhi. Renowned for innovation, research and industry partnerships, it consistently ranks among the top engineering colleges in India.",
    website: "https://www.iitd.ac.in",
    accreditation: "NAAC A++",
    totalStudents: 8500,
    facultyCount: 550,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["JEE Advanced", "GATE", "CAT"],
  },
  {
    name: "Indian Institute of Technology Madras",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Public",
    rating: 4.9,
    totalFees: 800000,
    placementPercentage: 97,
    avgPackage: 2200000,
    established: 1959,
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 60,
    topCourses: ["B.Tech", "M.Tech", "PhD", "Dual Degree"],
    nirf: 1,
    description: "IIT Madras, ranked #1 in NIRF engineering rankings, is a world-class institution set in a 600-acre campus with a deer park. It is known for exceptional research output and strong international collaborations.",
    website: "https://www.iitm.ac.in",
    accreditation: "NAAC A++",
    totalStudents: 9500,
    facultyCount: 580,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["JEE Advanced", "GATE"],
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    location: "Ahmedabad",
    state: "Gujarat",
    type: "Public",
    rating: 4.9,
    totalFees: 2300000,
    placementPercentage: 100,
    avgPackage: 3500000,
    established: 1961,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 8,
    topCourses: ["MBA (PGP)", "MBA (PGPX)", "PhD", "Executive MBA"],
    nirf: 1,
    description: "IIM Ahmedabad is India's most prestigious management school and one of the finest business schools in Asia. IIMA alumni lead major global corporations and have built impactful startups worldwide.",
    website: "https://www.iima.ac.in",
    accreditation: "AACSB",
    totalStudents: 1200,
    facultyCount: 110,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["CAT", "GMAT", "GRE"],
  },
  {
    name: "BITS Pilani",
    location: "Pilani",
    state: "Rajasthan",
    type: "Deemed",
    rating: 4.6,
    totalFees: 1900000,
    placementPercentage: 95,
    avgPackage: 1600000,
    established: 1964,
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 40,
    topCourses: ["B.E.", "M.Tech", "MBA", "M.Sc"],
    nirf: 25,
    description: "BITS Pilani is one of India's most autonomous and respected technical institutions. Its practice school program and strong alumni network make it a top choice for students aspiring to tech and business careers.",
    website: "https://www.bits-pilani.ac.in",
    accreditation: "NAAC A",
    totalStudents: 7000,
    facultyCount: 400,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["BITSAT"],
  },
  {
    name: "Delhi Technological University",
    location: "New Delhi",
    state: "Delhi",
    type: "Public",
    rating: 4.2,
    totalFees: 600000,
    placementPercentage: 88,
    avgPackage: 1000000,
    established: 1941,
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 30,
    topCourses: ["B.Tech", "M.Tech", "MBA", "MCA"],
    nirf: 36,
    description: "DTU (formerly DCE) is a premier state technical university in Delhi. It offers excellent engineering programs with strong industry connections and a vibrant campus life.",
    website: "https://dtu.ac.in",
    accreditation: "NAAC A+",
    totalStudents: 12000,
    facultyCount: 450,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["JEE Main", "JAC Delhi"],
  },
  {
    name: "National Institute of Technology Trichy",
    location: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "Public",
    rating: 4.5,
    totalFees: 550000,
    placementPercentage: 93,
    avgPackage: 1200000,
    established: 1964,
    imageUrl: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 45,
    topCourses: ["B.Tech", "M.Tech", "MBA", "MCA"],
    nirf: 8,
    description: "NIT Trichy is one of India's top NITs, consistently ranked in the top 10 engineering institutions. It boasts a beautiful campus and strong alumni network across industries.",
    website: "https://www.nitt.edu",
    accreditation: "NAAC A++",
    totalStudents: 7500,
    facultyCount: 360,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["JEE Main"],
  },
  {
    name: "Vellore Institute of Technology",
    location: "Vellore",
    state: "Tamil Nadu",
    type: "Deemed",
    rating: 4.0,
    totalFees: 750000,
    placementPercentage: 82,
    avgPackage: 750000,
    established: 1984,
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 55,
    topCourses: ["B.Tech", "M.Tech", "MBA", "BCA"],
    nirf: 11,
    description: "VIT Vellore is one of India's largest private universities offering a wide range of engineering and technology programs. Known for its strong placement support and industry tie-ups.",
    website: "https://vit.ac.in",
    accreditation: "NAAC A++",
    totalStudents: 35000,
    facultyCount: 2000,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["VITEEE", "JEE Main"],
  },
  {
    name: "Anna University",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Public",
    rating: 3.9,
    totalFees: 300000,
    placementPercentage: 75,
    avgPackage: 600000,
    established: 1978,
    imageUrl: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 80,
    topCourses: ["B.E.", "B.Tech", "M.E.", "MBA"],
    nirf: 18,
    description: "Anna University is a premier technical university in Tamil Nadu, affiliating over 500 engineering colleges. It is known for strong academic programs and extensive research facilities.",
    website: "https://www.annauniv.edu",
    accreditation: "NAAC A+",
    totalStudents: 8000,
    facultyCount: 500,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["TNEA", "JEE Main"],
  },
  {
    name: "Indian Institute of Management Bangalore",
    location: "Bengaluru",
    state: "Karnataka",
    type: "Public",
    rating: 4.8,
    totalFees: 2400000,
    placementPercentage: 100,
    avgPackage: 3200000,
    established: 1973,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
    coursesCount: 10,
    topCourses: ["MBA (PGP)", "PGPEM", "PhD", "Executive Education"],
    nirf: 2,
    description: "IIM Bangalore is one of India's top business schools, located in the technology hub of Bengaluru. IIMB is known for its excellence in management education, research, and entrepreneurship.",
    website: "https://www.iimb.ac.in",
    accreditation: "AACSB",
    totalStudents: 1500,
    facultyCount: 130,
    hostelAvailable: true,
    scholarshipAvailable: true,
    examAccepted: ["CAT", "GMAT"],
  },
];

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI or DATABASE_URL must be set.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  console.log("Checking existing data...");
  const count = await College.countDocuments();

  if (count > 0) {
    console.log(`Database already has ${count} colleges. Skipping seed.`);
    await mongoose.connection.close();
    return;
  }

  console.log("Seeding colleges...");
  const insertedColleges = await College.insertMany(collegesData);
  console.log(`Inserted ${insertedColleges.length} colleges.`);

  console.log("Seeding courses...");
  const courseData: any[] = [];
  for (const college of insertedColleges) {
    courseData.push(
      { collegeId: college._id, name: "B.Tech Computer Science", duration: "4 Years", fees: Math.round(Math.random() * 200000 + 100000), seats: 60, eligibility: "10+2 with PCM" },
      { collegeId: college._id, name: "B.Tech Electronics", duration: "4 Years", fees: Math.round(Math.random() * 200000 + 80000), seats: 60, eligibility: "10+2 with PCM" },
      { collegeId: college._id, name: "M.Tech Software", duration: "2 Years", fees: Math.round(Math.random() * 150000 + 60000), seats: 30, eligibility: "B.Tech + GATE" },
    );
  }
  await Course.insertMany(courseData);
  console.log(`Inserted ${courseData.length} courses.`);

  console.log("Seeding reviews...");
  const reviewData: any[] = [];
  const comments = [
    "Amazing faculty and infrastructure. The placement process is very well organized.",
    "Great campus life and excellent research opportunities.",
    "Strong industry connections and good exposure to real-world projects.",
    "The academic rigor is high but worth it. Placements are exceptional.",
    "Good college overall. Hostel facilities could be better.",
  ];

  for (const college of insertedColleges.slice(0, 5)) {
    reviewData.push(
      {
        collegeId: college._id,
        reviewerName: "Arjun Sharma",
        rating: 4,
        comment: comments[0],
        category: "Placements",
      },
      {
        collegeId: college._id,
        reviewerName: "Priya Nair",
        rating: 5,
        comment: comments[1],
        category: "Campus Life",
      },
    );
  }
  await Review.insertMany(reviewData);
  console.log(`Inserted ${reviewData.length} reviews.`);

  console.log("✅ Seeding complete!");
  await mongoose.connection.close();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
