import { sequelize } from '../config/database.js';
import { User, Job, JobRequest, Project, Proposal, Review, Payment, Withdrawal, Notification } from '../models/index.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    console.log('🔨 Resetting all tables...');
    await sequelize.sync({ force: true });
    
    console.log('👤 Creating users...');
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      isVerified: true,
      location: 'System',
      bio: 'System Administrator'
    });
    
    const clientUser = await User.create({
      name: 'John Client',
      email: 'client@example.com',
      password: 'client123',
      role: 'user',
      status: 'active',
      isVerified: true,
      location: 'New York, USA',
      bio: 'Tech entrepreneur looking for talented developers'
    });
    
    const developerUser = await User.create({
      name: 'Jane Developer',
      email: 'developer@example.com',
      password: 'dev123',
      role: 'developer',
      status: 'active',
      isVerified: true,
      location: 'San Francisco, USA',
      bio: 'Full-stack developer with 5+ years experience',
      skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      experienceLevel: 'Expert',
      hourlyRate: 75.00,
      rating: 4.8,
      totalProjects: 25,
      totalEarnings: 50000.00
    });
    
    const developerUser2 = await User.create({
      name: 'Mike Frontend',
      email: 'mike@example.com',
      password: 'mike123',
      role: 'developer',
      status: 'active',
      isVerified: true,
      location: 'Austin, USA',
      bio: 'Frontend specialist with modern frameworks',
      skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
      experienceLevel: 'Intermediate',
      hourlyRate: 55.00,
      rating: 4.5,
      totalProjects: 15,
      totalEarnings: 25000.00
    });
    
    console.log('💼 Creating sample jobs...');
    
    const job1 = await Job.create({
      title: 'E-commerce Website Development',
      description: 'Build a modern e-commerce platform with React and Node.js',
      requirements: 'Experience with React, Node.js, and payment integration',
      category: 'Web Development',
      skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      budget: 5000.00,
      budgetType: 'fixed',
      experienceLevel: 'Intermediate',
      projectType: 'One-time project',
      location: 'remote',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      duration: '2-3 months',
      clientId: clientUser.id,
      status: 'open'
    });
    
    console.log('📝 Creating sample job requests...');
    
    const jobRequest1 = await JobRequest.create({
      title: 'Mobile App Backend API',
      description: 'Develop REST API for mobile application',
      category: 'Backend Development',
      skills: ['Node.js', 'Express', 'PostgreSQL'],
      budget: 3000.00,
      budgetType: 'fixed',
      experienceLevel: 'Intermediate',
      projectType: 'One-time project',
      location: 'remote',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'accepted',
      clientId: clientUser.id,
      developerId: developerUser.id
    });
    
    const jobRequest2 = await JobRequest.create({
      title: 'React Dashboard Development',
      description: 'Create a modern admin dashboard with React and TypeScript',
      requirements: 'Experience with React, TypeScript, and data visualization',
      category: 'Frontend Development',
      skills: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
      budget: 2500.00,
      budgetType: 'fixed',
      experienceLevel: 'Intermediate',
      projectType: 'One-time project',
      location: 'remote',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      duration: '4-6 weeks',
      status: 'pending',
      message: 'Looking for a skilled React developer to build a comprehensive admin dashboard.',
      isUrgent: true,
      clientId: clientUser.id,
      developerId: developerUser.id
    });
    
    const jobRequest3 = await JobRequest.create({
      title: 'WordPress Plugin Development',
      description: 'Develop a custom WordPress plugin for inventory management',
      requirements: 'Strong PHP and WordPress development experience',
      category: 'WordPress Development',
      skills: ['PHP', 'WordPress', 'MySQL', 'JavaScript'],
      budget: 1800.00,
      budgetType: 'fixed',
      experienceLevel: 'Expert',
      projectType: 'One-time project',
      location: 'remote',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      duration: '3-4 weeks',
      status: 'pending',
      message: 'Need an experienced WordPress developer for a custom plugin project.',
      clientId: clientUser.id,
      developerId: developerUser2.id
    });
    
    const jobRequest4 = await JobRequest.create({
      title: 'Vue.js E-learning Platform',
      description: 'Build an interactive e-learning platform using Vue.js',
      requirements: 'Vue.js expertise, experience with video streaming and user authentication',
      category: 'Frontend Development',
      skills: ['Vue.js', 'Vuex', 'Node.js', 'Video Streaming'],
      budget: 4200.00,
      budgetType: 'fixed',
      experienceLevel: 'Expert',
      projectType: 'Ongoing work',
      location: 'remote',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      duration: '3-4 months',
      status: 'pending',
      message: 'Exciting opportunity to build a cutting-edge e-learning platform.',
      clientId: clientUser.id,
      developerId: developerUser2.id
    });
    
    console.log('🚀 Creating sample project...');
    
    const project1 = await Project.create({
      title: 'Mobile App Backend API',
      description: 'Develop REST API for mobile application',
      budget: 3000.00,
      budgetType: 'fixed',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      clientId: clientUser.id,
      developerId: developerUser.id,
      jobRequestId: jobRequest1.id,
      progress: 25
    });
    
    console.log('💡 Creating sample proposal...');
    
    const proposal1 = await Proposal.create({
      jobId: job1.id,
      developerId: developerUser2.id,
      coverLetter: 'I am excited to work on your e-commerce project. With my experience in React and Node.js, I can deliver a high-quality solution.',
      proposedBudget: 4800.00,
      estimatedDuration: '10 weeks',
      status: 'pending'
    });
    
    console.log('🔔 Creating sample notifications...');
    
    await Notification.create({
      userId: developerUser.id,
      title: 'New Direct Hire',
      message: 'You have been directly hired for: Mobile App Backend API',
      type: 'job',
      relatedId: jobRequest1.id,
      relatedType: 'job_request'
    });
    
    await Notification.create({
      userId: developerUser.id,
      title: 'New Job Request',
      message: 'You have received a new job request: React Dashboard Development',
      type: 'job',
      relatedId: jobRequest2.id,
      relatedType: 'job_request'
    });
    
    await Notification.create({
      userId: developerUser2.id,
      title: 'New Job Request',
      message: 'You have received a new job request: WordPress Plugin Development',
      type: 'job',
      relatedId: jobRequest3.id,
      relatedType: 'job_request'
    });
    
    await Notification.create({
      userId: developerUser2.id,
      title: 'New Job Request',
      message: 'You have received a new job request: Vue.js E-learning Platform',
      type: 'job',
      relatedId: jobRequest4.id,
      relatedType: 'job_request'
    });
    
    await Notification.create({
      userId: clientUser.id,
      title: 'New Proposal Received',
      message: 'You received a new proposal for: E-commerce Website Development',
      type: 'proposal',
      relatedId: proposal1.id,
      relatedType: 'proposal'
    });
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Created:');
    console.log(`   👤 Users: 4 (1 admin, 1 client, 2 developers)`);
    console.log(`   💼 Jobs: 1`);
    console.log(`   📝 Job Requests: 4 (1 accepted, 3 pending)`);
    console.log(`   🚀 Projects: 1`);
    console.log(`   💡 Proposals: 1`);
    console.log(`   🔔 Notifications: 6`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@gmail.com / admin123');
    console.log('   Client: client@example.com / client123');
    console.log('   Developer: developer@example.com / dev123');
    console.log('   Developer 2: mike@example.com / mike123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();