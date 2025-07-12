import User from './User.js';
import Job from './Job.js';
import JobRequest from './JobRequest.js';
import Proposal from './Proposal.js';
import Project from './Project.js';
import Review from './Review.js';
import Payment from './Payment.js';
import Withdrawal from './Withdrawal.js';
import Notification from './Notification.js';
import AdminEarnings from './AdminEarnings.js';
import ProposalFeedback from './ProposalFeedback.js';

User.hasMany(Job, { foreignKey: 'clientId', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

User.hasMany(Job, { foreignKey: 'assignedDeveloperId', as: 'assignedJobs' });
Job.belongsTo(User, { foreignKey: 'assignedDeveloperId', as: 'assignedDeveloper' });

User.hasMany(Proposal, { foreignKey: 'developerId', as: 'proposals' });
Proposal.belongsTo(User, { foreignKey: 'developerId', as: 'developer' });

Job.hasMany(Proposal, { foreignKey: 'jobId', as: 'proposals' });
Proposal.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

User.hasMany(Project, { foreignKey: 'clientId', as: 'clientProjects' });
Project.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

User.hasMany(Project, { foreignKey: 'developerId', as: 'developerProjects' });
Project.belongsTo(User, { foreignKey: 'developerId', as: 'developer' });

Job.hasOne(Project, { foreignKey: 'jobId', as: 'project' });
Project.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

User.hasMany(Review, { foreignKey: 'reviewerId', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

User.hasMany(Review, { foreignKey: 'revieweeId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'revieweeId', as: 'reviewee' });

Project.hasMany(Review, { foreignKey: 'projectId', as: 'reviews' });
Review.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Payment, { foreignKey: 'payerId', as: 'sentPayments' });
Payment.belongsTo(User, { foreignKey: 'payerId', as: 'payer' });

User.hasMany(Payment, { foreignKey: 'payeeId', as: 'receivedPayments' });
Payment.belongsTo(User, { foreignKey: 'payeeId', as: 'payee' });

Project.hasMany(Payment, { foreignKey: 'projectId', as: 'payments' });
Payment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(JobRequest, { foreignKey: 'clientId', as: 'sentJobRequests' });
JobRequest.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

User.hasMany(JobRequest, { foreignKey: 'developerId', as: 'receivedJobRequests' });
JobRequest.belongsTo(User, { foreignKey: 'developerId', as: 'developer' });

User.hasMany(Withdrawal, { foreignKey: 'developerId', as: 'withdrawals' });
Withdrawal.belongsTo(User, { foreignKey: 'developerId', as: 'developer' });

Withdrawal.hasOne(AdminEarnings, { foreignKey: 'withdrawalId', as: 'adminEarning' });
AdminEarnings.belongsTo(Withdrawal, { foreignKey: 'withdrawalId', as: 'withdrawal' });

User.hasMany(AdminEarnings, { foreignKey: 'developerId', as: 'adminEarnings' });
AdminEarnings.belongsTo(User, { foreignKey: 'developerId', as: 'developer' });

JobRequest.hasOne(Project, { foreignKey: 'jobRequestId', as: 'project' });
Project.belongsTo(JobRequest, { foreignKey: 'jobRequestId', as: 'jobRequest' });

Proposal.hasMany(ProposalFeedback, { foreignKey: 'proposalId', as: 'feedbacks' });
ProposalFeedback.belongsTo(Proposal, { foreignKey: 'proposalId', as: 'proposal' });

User.hasMany(ProposalFeedback, { foreignKey: 'senderId', as: 'sentFeedbacks' });
ProposalFeedback.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(ProposalFeedback, { foreignKey: 'receiverId', as: 'receivedFeedbacks' });
ProposalFeedback.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export {
  User,
  Job,
  JobRequest,
  Proposal,
  Project,
  Review,
  Payment,
  Withdrawal,
  Notification,
  AdminEarnings,
  ProposalFeedback
};