import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  FileText 
} from 'lucide-react';
import ProjectModal from './ProjectModal';

const ProjectGrid = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      client: 'TechCorp Inc.',
      developer: 'John Doe',
      status: 'In Progress',
      priority: 'High',
      progress: 75,
      startDate: '2024-01-15',
      deadline: '2024-02-15',
      budget: '$12,500',
      spent: '$9,375',
      category: 'Web Development',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      teamSize: 4,
      messages: 23,
      files: 15
    },
    {
      id: 2,
      title: 'Mobile App Development',
      description: 'iOS and Android app for fitness tracking',
      client: 'StartupXYZ',
      developer: 'Sarah Smith',
      status: 'Completed',
      priority: 'Medium',
      progress: 100,
      startDate: '2023-12-01',
      deadline: '2024-01-30',
      budget: '$8,750',
      spent: '$8,200',
      category: 'Mobile Development',
      technologies: ['React Native', 'Firebase', 'Redux'],
      teamSize: 3,
      messages: 45,
      files: 28
    },
    {
      id: 3,
      title: 'Website Redesign',
      description: 'Complete redesign of corporate website',
      client: 'Creative Agency',
      developer: 'Mike Johnson',
      status: 'Pending',
      priority: 'Low',
      progress: 25,
      startDate: '2024-02-01',
      deadline: '2024-03-01',
      budget: '$5,200',
      spent: '$1,300',
      category: 'Design',
      technologies: ['Figma', 'HTML', 'CSS', 'JavaScript'],
      teamSize: 2,
      messages: 12,
      files: 8
    },
    {
      id: 4,
      title: 'Data Analytics Dashboard',
      description: 'Business intelligence dashboard with real-time data',
      client: 'DataCorp',
      developer: 'Emily Davis',
      status: 'In Progress',
      priority: 'High',
      progress: 60,
      startDate: '2024-01-10',
      deadline: '2024-02-20',
      budget: '$15,000',
      spent: '$9,000',
      category: 'Data Science',
      technologies: ['Python', 'Django', 'PostgreSQL', 'Chart.js'],
      teamSize: 5,
      messages: 67,
      files: 32
    },
    {
      id: 5,
      title: 'API Development',
      description: 'RESTful API for third-party integrations',
      client: 'TechStartup',
      developer: 'Robert Wilson',
      status: 'Review',
      priority: 'Medium',
      progress: 90,
      startDate: '2024-01-05',
      deadline: '2024-02-05',
      budget: '$6,800',
      spent: '$6,120',
      category: 'Backend Development',
      technologies: ['Node.js', 'Express', 'MySQL', 'JWT'],
      teamSize: 2,
      messages: 18,
      files: 12
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#d97757] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{project.teamSize} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{project.deadline}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{project.spent} / {project.budget}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{project.messages}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{project.files}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-sm">
                  <p className="text-gray-600">Client: <span className="font-medium text-gray-900">{project.client}</span></p>
                  <p className="text-gray-600">Developer: <span className="font-medium text-gray-900">{project.developer}</span></p>
                </div>
                <button 
                  onClick={() => handleViewProject(project)}
                  className="text-[#d97757] hover:text-[#c86a4a] text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        project={selectedProject}
      />
    </>
  );
};

export default ProjectGrid;