import fs from 'fs';
import path from 'path';

// 1. Preserve original 17 screenshot emails
const originalEmails = [
  {
    id: '1',
    sender: 'Team AccioJob',
    subject: 'about your Guru Tegh Bahadur Institute of Technology - [GTBIT] placements',
    snippet: '- like a senior giving feedback on your performance and career roadmap',
    time: '1:08 PM',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Ansh,\n\nWe recently analyzed the placement statistics for Guru Tegh Bahadur Institute of Technology - [GTBIT] and wanted to share actionable feedback on your preparation for upcoming software engineering interviews.\n\nKey areas covered:\n- Data Structures & Algorithms preparation milestones\n- System Design fundamentals\n- Mock interview schedules and senior mentorship\n\nBest regards,\nTeam AccioJob`
  },
  {
    id: '2',
    sender: 'Zoom',
    subject: 'Webinar information has been updated - FREE 20-HOUR GENAI ENGINEERING BOOTCAMP',
    snippet: '- - Hi Puri Ansh, The webinar information has been updated with the latest session links and schedule.',
    time: 'Oct 18',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: true,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri Ansh,\n\nThe host has updated the webinar information for FREE 20-HOUR GENAI ENGINEERING BOOTCAMP.\n\nDate: Saturday, Oct 21, 2026\nTime: 10:00 AM IST\nTopic: Building LLM Applications with LangChain & RAG\n\nPlease use the link below to join when the session begins.`
  },
  {
    id: '3',
    sender: 'Zoom',
    subject: 'FREE 20-HOUR GENAI ENGINEERING BOOTCAMP - - Confirmation',
    snippet: '- Hi Puri Ansh, Thank you for registering for FREE 20-HOUR GENAI ENGINEERING BOOTCAMP.',
    time: 'Oct 18',
    unread: false,
    starred: false,
    selected: false,
    hasCalendar: true,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri Ansh,\n\nThank you for registering for FREE 20-HOUR GENAI ENGINEERING BOOTCAMP. We look forward to having you with us.\n\nAdd to calendar: Google Calendar | Outlook | iCal`
  },
  {
    id: '4',
    sender: 'Zoom',
    subject: 'Your registration for webinar FREE 20-HOUR GENAI ENGINEERING BOOTCAMP - - has been denied',
    snippet: '- Hi Puri, Your registration for session 2 has been updated.',
    time: 'Oct 18',
    unread: false,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri,\n\nYour registration for the overflow batch was consolidated into Batch 1. You do not need to register again for Batch 2.`
  },
  {
    id: '5',
    sender: 'Zoom',
    subject: 'Reminder: FREE 20-HOUR GENAI ENGINEERING BOOTCAMP - - starts in 1 hour',
    snippet: '- Hi Puri Ansh, This is a reminder that your webinar will begin shortly.',
    time: 'Oct 18',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri Ansh,\n\nThis is a quick reminder that FREE 20-HOUR GENAI ENGINEERING BOOTCAMP starts in 1 hour.\n\nPlease check your audio and video setup in advance.`
  },
  {
    id: '6',
    sender: 'Zoom',
    subject: 'Webinar information has been updated - FREE 20-HOUR GENAI ENGINEERING BOOTCAMP',
    snippet: '- - Hi Puri Ansh, The webinar slides and workshop repo are now available.',
    time: 'Oct 18',
    unread: false,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri Ansh,\n\nThe instructor has shared the prerequisite GitHub repositories and starter notebooks for the bootcamp.`
  },
  {
    id: '7',
    sender: 'Zoom',
    subject: 'Webinar information has been updated - FREE 20-HOUR GENAI ENGINEERING BOOTCAMP',
    snippet: '- Hi Puri Ansh, The webinar information has been updated with instructor bio and Q&A guidelines.',
    time: 'Oct 18',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: true,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri Ansh,\n\nPlease review the community guidelines and Discord server link for ongoing Q&A during the bootcamp.`
  },
  {
    id: '8',
    sender: 'ISP Team from Inter.',
    subject: 'Update: Your application has been accepted',
    snippet: '- Internshala Student Program Internshala Hello Candidate, Explore opportunities at Internshala Student Partner program...',
    time: 'Oct 18',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Congratulations!\n\nYour application for the Internshala Student Partner (ISP) program has been accepted. Join thousands of student ambassadors across India leading tech chapters.`
  },
  {
    id: '9',
    sender: 'Zoom',
    subject: 'Complete your webinar registration',
    snippet: '- You have new registration questions to complete Hi Puri Ansh , Your registration for FREE 20-HOUR GENAI BOOTCAMP...',
    time: 'Oct 18',
    unread: false,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri Ansh,\n\nPlease take 30 seconds to answer our 2 pre-course survey questions so we can tailor the hands-on coding demos.`
  },
  {
    id: '10',
    sender: 'Team Unstop',
    subject: 'Your Google Rewards Are Here! Unlock Credits, Badges & More',
    snippet: '- Apply Now! Top performers receive exclusive Google Cloud certifications and swags.',
    time: 'Oct 18',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hello Tech Enthusiast,\n\nReady to showcase your skills? The Google Cloud Challenge is now live on Unstop. Register and claim your cloud credits today!`
  },
  {
    id: '11',
    sender: 'Zoom',
    subject: 'FREE 20-HOUR GENAI ENGINEERING BOOTCAMP Confirmation',
    snippet: '- Hi Puri Ansh, Thank you for registering for FREE 20-HOUR GENAI ENGINEERING BOOTCAMP.',
    time: 'Oct 18',
    unread: false,
    starred: false,
    selected: false,
    hasCalendar: true,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri Ansh,\n\nYour seat is confirmed! Click below to add the recurring calendar reminder.`
  },
  {
    id: '12',
    sender: 'ISP Team from Inter.',
    subject: 'Update: Your application has been accepted',
    snippet: '- Hurry up—Applications close tomorrow. Don\'t miss out on securing your spot.',
    time: 'Oct 18',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: true,
    category: 'primary',
    body: `Dear Applicant,\n\nThis is a friendly reminder that ISP onboarding orientation starts tomorrow at 5 PM.\n\nIf you no longer wish to receive these alerts, you can unsubscribe below.`
  },
  {
    id: '13',
    sender: 'Zoom',
    subject: 'Your registration for webinar FREE 20-HOUR GENAI ENGINEERING BOOTCAMP - has been denied',
    snippet: '- Hi Puri, Your registration for previous duplicate slot has been canceled.',
    time: 'Oct 17',
    unread: false,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'primary',
    body: `Hi Puri,\n\nThis is confirmation that the duplicate slot reservation was cleared.`
  },
  {
    id: '14',
    sender: 'Internshala',
    subject: 'Action needed: finish your profile to unlock 5,000+ top internships',
    snippet: '- Complete your skill assessment tests and get certified today.',
    time: 'Oct 17',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: true,
    category: 'promotions',
    body: `Companies are actively hiring for winter internships. Complete your profile today!`
  },
  {
    id: '15',
    sender: 'Coursera',
    subject: 'Special offer: 50% off Google Professional Certificates',
    snippet: '- Advance your career with in-demand skills in AI, Data, and Cybersecurity.',
    time: 'Oct 16',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: true,
    category: 'promotions',
    body: `Learn at your own pace from industry leaders at Google, IBM, and Meta.`
  },
  {
    id: '16',
    sender: 'LinkedIn',
    subject: 'You have 1 new invitation from John Doe (Staff Engineer at Google)',
    snippet: '- "Hey Ansh, I noticed your work on modern web technologies..."',
    time: 'Oct 17',
    unread: true,
    starred: true,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'social',
    body: `John Doe would like to connect with you on LinkedIn.\n\n"Hey Ansh, I noticed your work on modern web technologies and would love to stay in touch!"`
  },
  {
    id: '17',
    sender: 'Internshala',
    subject: 'Update: You have 3 new matching internship recommendations',
    snippet: '- React Developer, Full Stack Engineer Intern, and AI Research Fellow',
    time: 'Oct 18',
    unread: true,
    starred: false,
    selected: false,
    hasCalendar: false,
    hasUnsubscribe: false,
    category: 'updates',
    body: `Here are fresh opportunities that match your profile preferences.`
  }
];

// 2. Additional realistic emails spanning October -> September -> August -> July (all the way to Jul 3!)
const additionalEmails = [
  // --- OCTOBER ---
  {
    id: '18',
    sender: 'Google Careers',
    subject: 'Application Status: Software Engineer University Graduate 2027',
    snippet: '- Thank you for taking the time to speak with our campus recruiting team.',
    time: 'Oct 16',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    id: '19',
    sender: 'GitHub',
    subject: '[Security Advisory] High severity vulnerability in package lodash',
    snippet: '- Dependabot has created a security pull request #34 for your repository.',
    time: 'Oct 15',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    id: '20',
    sender: 'Microsoft Learn',
    subject: 'Your Azure AI Fundamentals Exam Voucher is ready',
    snippet: '- Claim your 100% discount voucher for Microsoft Certified: Azure AI Fundamentals.',
    time: 'Oct 14',
    unread: false,
    starred: true,
    category: 'primary'
  },
  {
    id: '21',
    sender: 'Placement Cell GTBIT',
    subject: 'Campus Drive Notification: Deloitte USI shortlists announced',
    snippet: '- Shortlisted candidates for Associate Analyst role must report tomorrow at 9 AM.',
    time: 'Oct 13',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    id: '22',
    sender: 'Prof. R.K. Sharma',
    subject: 'Final Year Major Project Submission Guidelines & Schedule',
    snippet: '- Synopsis and preliminary literature review must be submitted by Friday.',
    time: 'Oct 12',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    id: '23',
    sender: 'Swiggy',
    subject: 'Craving Biryani? Get 60% OFF on your favorite restaurants tonight!',
    snippet: '- Use code TASTY60 on orders above ₹199. Valid till 11:59 PM today.',
    time: 'Oct 12',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '24',
    sender: 'LinkedIn',
    subject: 'Rohan Verma and 4 other recruiters viewed your profile this week',
    snippet: '- See the full list of companies and alumni who searched for your skills.',
    time: 'Oct 11',
    unread: true,
    starred: false,
    category: 'social'
  },
  {
    id: '25',
    sender: 'Google Cloud Platform',
    subject: 'Invoice for Billing Account 012A34-BC5678: $14.20 processed successfully',
    snippet: '- Automatic payment charged to Visa ending in 4092. Download tax invoice PDF.',
    time: 'Oct 10',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '26',
    sender: 'Vercel',
    subject: 'Deployment successful: portfolio-v3 (production)',
    snippet: '- Your project was deployed to production in 18 seconds across 18 edge locations.',
    time: 'Oct 09',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '27',
    sender: 'LeetCode',
    subject: 'Weekly Contest 420 Results: You placed in the top 4%!',
    snippet: '- Rating update: +48 points! Your new contest rating is 1,842 (Knight candidate).',
    time: 'Oct 08',
    unread: false,
    starred: true,
    category: 'primary'
  },
  {
    id: '28',
    sender: 'Amazon.in',
    subject: 'Great Indian Festival: Sony WH-1000XM5 Headphones at lowest price',
    snippet: '- Extra ₹3,000 instant bank discount on ICICI and SBI credit cards.',
    time: 'Oct 07',
    unread: true,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '29',
    sender: 'Stripe',
    subject: 'Payment Successful: $49.00 USD from customer Acme Corp',
    snippet: '- Payment for Monthly SaaS Pro Plan was received via card ending in 8812.',
    time: 'Oct 06',
    unread: true,
    starred: false,
    category: 'updates'
  },
  {
    id: '30',
    sender: 'Discord',
    subject: 'Reactiflux Announcement: Live Q&A with Vite and Tailwind core teams',
    snippet: '- Join stage voice channel this Friday at 8 PM UTC for open discussions.',
    time: 'Oct 05',
    unread: false,
    starred: false,
    hasCalendar: true,
    category: 'social'
  },
  {
    id: '31',
    sender: 'Smart India Hackathon',
    subject: 'SIH Internal Hackathon Shortlisted Teams Announced',
    snippet: '- Team "NeuralBytes" led by Ansh Puri has been selected to represent the college.',
    time: 'Oct 04',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    id: '32',
    sender: 'Udemy',
    subject: 'Flash Sale: All top web development and AI courses at ₹499',
    snippet: '- Learn Next.js 15, Docker, Kubernetes, and Machine Learning from top instructors.',
    time: 'Oct 03',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '33',
    sender: 'GitHub Actions',
    subject: 'Workflow run "CI/CD Pipeline #412" completed successfully on main branch',
    snippet: '- 18 tests passed, 0 failures, lint check green in 1m 42s.',
    time: 'Oct 02',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '34',
    sender: 'Reddit',
    subject: 'r/webdev: "What is the single most important habit for junior devs in 2026?"',
    snippet: '- 480 comments and 1.8k upvotes on open-source code reading habits.',
    time: 'Oct 01',
    unread: false,
    starred: false,
    category: 'social'
  },

  // --- SEPTEMBER ---
  {
    id: '35',
    sender: 'OpenAI Developer Forum',
    subject: 'Welcome to the OpenAI Developer Community & Beta Access',
    snippet: '- Explore cookbooks, share prompting patterns, and connect with fellow builders.',
    time: 'Sep 30',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '36',
    sender: 'Flipkart',
    subject: 'Big Billion Days Early Access: Gaming laptops starting ₹39,990',
    snippet: '- Wishlist your favorite electronics now with no-cost EMI on all leading banks.',
    time: 'Sep 29',
    unread: true,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '37',
    sender: 'PayPal',
    subject: 'You received a payment of $120.00 USD from Upwork Global Inc.',
    snippet: '- The funds are now available in your PayPal balance and ready for transfer.',
    time: 'Sep 28',
    unread: true,
    starred: true,
    category: 'updates'
  },
  {
    id: '38',
    sender: 'Hugging Face',
    subject: 'Your model "bert-financial-sentiment" reached 1,000 downloads!',
    snippet: '- Milestone reached: community members are running inference on your fine-tuned weights.',
    time: 'Sep 27',
    unread: false,
    starred: true,
    category: 'primary'
  },
  {
    id: '39',
    sender: 'YouTube',
    subject: 'Fireship uploaded: "AI is changing software engineering faster than you think"',
    snippet: '- A 100-second breakdown of autonomous developer agents and LLM code completion.',
    time: 'Sep 26',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    id: '40',
    sender: 'Zomato',
    subject: 'Flat ₹150 OFF with code GOURMET on top cafes near you',
    snippet: '- Experience the finest wood-fired pizzas, specialty coffee, and desserts.',
    time: 'Sep 25',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '41',
    sender: 'AWS Billing',
    subject: 'AWS Budget Alert: You have reached 80% of your Monthly Free Tier limit',
    snippet: '- Actual EC2 t2.micro usage has reached 600 hours out of 750 free hours.',
    time: 'Sep 24',
    unread: true,
    starred: false,
    category: 'updates'
  },
  {
    id: '42',
    sender: 'Anthropic',
    subject: 'Claude API Tier Updated: Increased Rate Limits Approved',
    snippet: '- Your workspace has been approved for Tier 2 rate limits (1,000 RPM).',
    time: 'Sep 23',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '43',
    sender: 'Medium Daily Digest',
    subject: '10 System Design Principles Every Software Engineer Must Know',
    snippet: '- Published in The Startup by former Meta Staff Engineer: caching, sharding, and CAP theorem.',
    time: 'Sep 22',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    id: '44',
    sender: 'Spotify',
    subject: 'Get 3 months of Spotify Premium for just ₹119',
    snippet: '- Ad-free music listening, offline downloads, and unlimited skips on all devices.',
    time: 'Sep 21',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '45',
    sender: 'Razorpay',
    subject: 'Settlement UTR# 948271048: ₹18,500 credited to your HDFC Bank account',
    snippet: '- Daily merchant settlement for store transactions has been cleared by nodal bank.',
    time: 'Sep 20',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '46',
    sender: 'Overleaf',
    subject: 'Ankit shared the LaTeX paper "Transformer Quantization" with you',
    snippet: '- Click to open the collaborative editor and start reviewing section 4.',
    time: 'Sep 19',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    id: '47',
    sender: 'Dev.to',
    subject: 'Top 7 Open Source Repositories to Contribute to this Hacktoberfest',
    snippet: '- Beginner-friendly issues with "good first issue" tags in JavaScript, Rust, and Go.',
    time: 'Sep 18',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    id: '48',
    sender: 'Domino\'s Pizza',
    subject: 'Buy 1 Get 1 FREE on all Medium Veg & Non-Veg Pizzas today',
    snippet: '- Fresh dough, cheese burst crust, and your favorite toppings doubled!',
    time: 'Sep 17',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '49',
    sender: 'Apple',
    subject: 'Your receipt from Apple: iCloud+ with 200 GB Storage Plan - ₹219',
    snippet: '- Subscription renewed on Sep 17, 2026. Charged to Apple Account balance.',
    time: 'Sep 16',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '50',
    sender: 'Google Developer Groups',
    subject: 'Confirmation: GDG DevFest 2026 Attendee Pass Issued',
    snippet: '- We look forward to seeing you at India Habitat Centre this Saturday.',
    time: 'Sep 15',
    unread: false,
    starred: true,
    hasCalendar: true,
    category: 'primary'
  },
  {
    id: '51',
    sender: 'Product Hunt',
    subject: '#1 Product of the Day: Cursor 2.0 - The Next-Gen AI Code Editor',
    snippet: '- Multi-file editing, predictive codebase index, and seamless terminal integration.',
    time: 'Sep 14',
    unread: true,
    starred: false,
    category: 'social'
  },
  {
    id: '52',
    sender: 'Nike',
    subject: 'Just Dropped: Air Jordan 1 Low Retro Collection',
    snippet: '- Iconic court style meets everyday comfort in classic Chicago and Royal color schemes.',
    time: 'Sep 13',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '53',
    sender: 'Notion',
    subject: 'Page Updated: "Engineering Roadmap Q3-Q4 2026" modified by Alex Turner',
    snippet: '- 4 tasks marked as complete in Sprint Backlog board.',
    time: 'Sep 12',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '54',
    sender: 'Supabase',
    subject: 'Database upgrade completed for project "gemini-hackathon"',
    snippet: '- Postgres 16.4 upgrade completed with 0 downtime on aws-ap-south-1.',
    time: 'Sep 10',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '55',
    sender: 'Stack Overflow',
    subject: 'Your answer to "Optimize React re-renders with useMemo" reached 50 upvotes',
    snippet: '- You earned the "Enlightened" badge and +500 reputation points.',
    time: 'Sep 08',
    unread: false,
    starred: true,
    category: 'social'
  },
  {
    id: '56',
    sender: 'Myntra',
    subject: 'Fashion Carnival: 50-80% off on Nike, Puma, Levi\'s & Tommy Hilfiger',
    snippet: '- Extra ₹500 off on your first order with coupon FIRST500.',
    time: 'Sep 06',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '57',
    sender: 'Slack',
    subject: 'Weekly Digest: 28 unread messages across #general and #engineering',
    snippet: '- Standup schedule updates and Q3 product sprint demos recordings.',
    time: 'Sep 04',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '58',
    sender: 'HackerRank',
    subject: 'Certificate Earned: Problem Solving (Advanced) Assessment',
    snippet: '- View and share your verified certificate on LinkedIn and your resume.',
    time: 'Sep 02',
    unread: false,
    starred: true,
    category: 'primary'
  },

  // --- AUGUST ---
  {
    id: '59',
    sender: 'Dean of Academic Affairs',
    subject: 'Academic Calendar Announcement: Fall Semester 2026 Commencement',
    snippet: '- Teaching schedules, lab allocations, and library timings published for odd semesters.',
    time: 'Aug 31',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    id: '60',
    sender: 'The Pragmatic Engineer',
    subject: 'New Post: The State of Engineering Compensation in Q3 2026',
    snippet: '- In-depth analysis of tech hiring trends, equity vs cash, and junior developer markets.',
    time: 'Aug 29',
    unread: true,
    starred: true,
    category: 'social'
  },
  {
    id: '61',
    sender: 'boAt Lifestyle',
    subject: 'Immortal 121 Gaming Earbuds launch offer: Just ₹999',
    snippet: '- Ultra-low 40ms latency, RGB beast mode lights, and 40 hours total playback.',
    time: 'Aug 27',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '62',
    sender: 'Netlify',
    subject: 'Production build succeeded for site: tech-portfolio-v2.netlify.app',
    snippet: '- Deploy preview #88 merged into production with instantaneous cache invalidation.',
    time: 'Aug 25',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '63',
    sender: 'Cloudflare',
    subject: 'DDoS Attack Mitigated on domain ansh-puri.dev',
    snippet: '- Cloudflare edge automatically dropped 42,000 malicious HTTP requests.',
    time: 'Aug 23',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '64',
    sender: 'freeCodeCamp.org',
    subject: 'New Course: Full-Stack AI Engineering with Next.js & Python (10 Hours)',
    snippet: '- Build RAG pipelines, fine-tune models, and deploy full production apps.',
    time: 'Aug 21',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    id: '65',
    sender: 'Uber',
    subject: '50% OFF your next 3 Premier rides across Delhi NCR',
    snippet: '- Travel in comfort with top-rated drivers and sanitised AC cabs.',
    time: 'Aug 19',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '66',
    sender: 'Docker Hub',
    subject: 'Automated build completed: joyboy/ai-inference-service:latest',
    snippet: '- Multi-arch image built (linux/amd64, linux/arm64) and pushed to container registry.',
    time: 'Aug 17',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '67',
    sender: 'Atlassian Jira',
    subject: '[GTBIT-DEV] Issue GTBIT-380 assigned to you: Setup Redis Cluster',
    snippet: '- Priority: High | Component: Database Infrastructure | Reporter: Tech Lead',
    time: 'Aug 15',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    id: '68',
    sender: 'LinkedIn',
    subject: 'Congratulate Priya Sharma for starting as SDE-1 at Amazon',
    snippet: '- Priya is celebrating 1 year since graduating from GTBIT. Send your congratulations!',
    time: 'Aug 13',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    id: '69',
    sender: 'Grammarly',
    subject: 'Independence Day Sale: Upgrade to Grammarly Premium with 50% OFF',
    snippet: '- Enhance clarity, tone, vocabulary, and full-sentence rewrites for research papers.',
    time: 'Aug 11',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '70',
    sender: 'Vercel',
    subject: 'Production Domain DNS records verified for ansh-puri.dev',
    snippet: '- SSL/TLS certificate issued and renewed automatically with Let\'s Encrypt.',
    time: 'Aug 09',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '71',
    sender: 'CodeChef',
    subject: 'Starters 150 Editorial & Rating Updates',
    snippet: '- Check out video editorials by 7-star competitive programmers for problems A through F.',
    time: 'Aug 07',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '72',
    sender: 'Discord',
    subject: 'Direct Message from Sarah (Open Source Lead): "Loved your PR on UI table!"',
    snippet: '- "Would you be interested in joining as a core maintainer for the next release?"',
    time: 'Aug 05',
    unread: true,
    starred: true,
    category: 'social'
  },
  {
    id: '73',
    sender: 'Blinkit',
    subject: 'Order fresh groceries in 10 minutes - Free delivery on orders above ₹199',
    snippet: '- Fresh milk, fruits, vegetables, snacks, and tech essentials delivered instantly.',
    time: 'Aug 03',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '74',
    sender: 'Google Account',
    subject: 'Security Alert: New sign-in detected on Ubuntu Linux',
    snippet: '- Chrome on Linux was used to sign into your Google Account from New Delhi, India.',
    time: 'Aug 01',
    unread: false,
    starred: false,
    category: 'updates'
  },

  // --- JULY (ALL THE WAY TO JUL 3!) ---
  {
    id: '75',
    sender: 'MongoDB Atlas',
    subject: 'Cluster Maintenance Notice: Scheduled upgrade on AWS ap-south-1',
    snippet: '- Seamless failover scheduled for Sunday between 02:00 UTC and 04:00 UTC.',
    time: 'Jul 30',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '76',
    sender: 'Threads',
    subject: 'Guillermo Rauch posted: "The web is faster today than it has ever been"',
    snippet: '- 840 likes and 120 replies debating edge computing vs traditional server clusters.',
    time: 'Jul 28',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    id: '77',
    sender: 'MakeMyTrip',
    subject: 'Flight Flash Sale: Domestic flights starting from ₹1,499',
    snippet: '- Book your monsoon travel now with zero cancellation fees on domestic flights.',
    time: 'Jul 26',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '78',
    sender: 'Cloudflare Zero Trust',
    subject: 'Weekly Security Digest: 0 threats detected across your organization',
    snippet: '- 18,200 DNS queries inspected, 0 phishing domains intercepted, 100% uptime.',
    time: 'Jul 24',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '79',
    sender: 'Docker',
    subject: 'Docker Desktop 4.32 is now available for Linux and macOS',
    snippet: '- Includes Docker AI Assistant, improved virtual filesystem caching, and faster buildx.',
    time: 'Jul 22',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '80',
    sender: 'Twitter / X',
    subject: 'Trending in Tech: "React 19 official release candidate announced"',
    snippet: '- 24.5K posts from engineers and frontend developers discussing server actions.',
    time: 'Jul 20',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    id: '81',
    sender: 'Cult.fit',
    subject: 'Monsoon Fitness Challenge: Flat ₹3,000 OFF on Cultpass Elite membership',
    snippet: '- Unlimited access to gym, boxing, dance fitness, yoga, and S&C classes.',
    time: 'Jul 18',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '82',
    sender: 'Postman',
    subject: 'API Testing Bootcamp: Hands-on Collection Run Results',
    snippet: '- All 14 automated API test cases passed across your authentication workflow.',
    time: 'Jul 16',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '83',
    sender: 'GitHub',
    subject: '[facebook/react] @dan-abramov commented on your discussion thread',
    snippet: '- "This is an interesting edge case with useTransition in React 19..."',
    time: 'Jul 14',
    unread: true,
    starred: true,
    category: 'social'
  },
  {
    id: '84',
    sender: 'Adobe Creative Cloud',
    subject: 'Save 40% on Photoshop, Illustrator, Premiere Pro and After Effects',
    snippet: '- Students & educators get the complete All Apps plan with generative AI credits.',
    time: 'Jul 12',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '85',
    sender: 'Kaggle',
    subject: 'New Competition: LLM Prompt Recovery - $50,000 Prize Pool',
    snippet: '- Predict the original system prompt given model inputs and outputs.',
    time: 'Jul 10',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    id: '86',
    sender: 'BookMyShow',
    subject: 'Exclusive Pre-Sale: Live Symphony Orchestra at Siri Fort Auditorium',
    snippet: '- Book your lounge and front-row seats before general tickets open to public.',
    time: 'Jul 08',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '87',
    sender: 'Postmark',
    subject: 'Inbound Webhook Delivery Alert: 2 retries succeeded on production',
    snippet: '- Inbound email parsing server recovered and processed remaining queue items.',
    time: 'Jul 06',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '88',
    sender: 'Google Summer of Code',
    subject: 'GSoC 2026: Mid-Term Evaluations Submission Open',
    snippet: '- Submit your midterm project milestone report and contributor feedback before deadline.',
    time: 'Jul 05',
    unread: true,
    starred: true,
    hasCalendar: true,
    category: 'primary'
  },
  {
    id: '89',
    sender: 'Decathlon',
    subject: 'Monsoon Hiking & Waterproof Gear: Quechua boots & rain poncho sale',
    snippet: '- Tested in torrential Western Ghats downpours with 2-year waterproof guarantee.',
    time: 'Jul 04',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '90',
    sender: 'DigitalOcean',
    subject: 'Scheduled maintenance for SGP1 region droplets completed',
    snippet: '- All network hypervisors and SSD storage pools are running at full performance.',
    time: 'Jul 29',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '91',
    sender: 'Figma Community',
    subject: 'Trending Plugin: Auto-Generate Clean Responsive Layouts in 1 Click',
    snippet: '- Check out the top-rated design utility featured in this week\'s Figma showcase.',
    time: 'Jul 25',
    unread: true,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '92',
    sender: 'LeetCode',
    subject: 'Biweekly Contest 134 Rating update & solution discussions',
    snippet: '- Your contest rating increased by +34 points! Review optimal algorithms from the leaderboard.',
    time: 'Jul 21',
    unread: false,
    starred: true,
    category: 'primary'
  },
  {
    id: '93',
    sender: 'Spotify for Artists',
    subject: 'Your July indie coding mix hit 10,000 monthly listeners',
    snippet: '- See which tracks are trending and where your listeners are tuning in from.',
    time: 'Jul 17',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '94',
    sender: 'Blinkit',
    subject: 'Order Delivered: 10-minute grocery delivery receipt #BLK-89210',
    snippet: '- Delivered to your door: Cold brew coffee, roasted almonds, and dark chocolate.',
    time: 'Jul 15',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '95',
    sender: 'Zomato Gold',
    subject: 'Weekend Dining Perks: 1+1 on dining at Connaught Place rooftop lounges',
    snippet: '- Enjoy complimentary beverages and chef specials at partner restaurants.',
    time: 'Jul 13',
    unread: true,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    id: '96',
    sender: 'MongoDB Atlas',
    subject: 'Performance Advisor Alert: Suggested compound index on collection "messages"',
    snippet: '- Adding index { userId: 1, createdAt: -1 } will reduce scan ratio by 85%.',
    time: 'Jul 11',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    id: '97',
    sender: 'Kaggle',
    subject: 'New Competition: LLM Guardrail Safety and Prompt Injection Defense ($50,000)',
    snippet: '- Build robust prompt defense mechanisms against adversarial jailbreak attempts.',
    time: 'Jul 09',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    id: '98',
    sender: 'HackerRank',
    subject: 'Skill Certification Verified: Advanced Problem Solving & Data Structures',
    snippet: '- You passed the test with a 100% score! Share your verified badge on LinkedIn.',
    time: 'Jul 07',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    id: '99',
    sender: 'GTBIT CSE Department',
    subject: 'Final Year Capstone Project Guidelines & Lab Manual 2026-27 Released',
    snippet: '- Download the syllabus, mentor allocation form, and project submission guidelines.',
    time: 'Jul 04',
    unread: true,
    starred: true,
    hasCalendar: true,
    category: 'primary',
    body: `Dear Final Year Students,\n\nThe Computer Science & Engineering department has published the Capstone Project Guidelines for the odd semester 2026-27.\n\nAll project teams must submit their project synopsis and mentor preference before July 12.\n\nRegards,\nHead of Department, CSE\nGTBIT, New Delhi`
  },
  {
    id: '100',
    sender: 'Academic Registrar GTBIT',
    subject: 'Welcome to Academic Year 2026-27: Orientation & Semester Registration Schedule',
    snippet: '- Orientation for odd semester begins July 10 in main auditorium. Complete fee clearance by July 8.',
    time: 'Jul 3',
    unread: true,
    starred: true,
    hasCalendar: true,
    category: 'primary',
    body: `Dear Students,\n\nWelcome to the Academic Session 2026-27 at Guru Tegh Bahadur Institute of Technology.\n\nKey Dates:\n- Semester Registration Closes: July 8, 2026\n- Orientation Ceremony: July 10, 2026 at 10:00 AM in the Main Auditorium\n- Commencement of Regular Classes: July 15, 2026\n\nPlease ensure your hostel and bus registrations are completed through the college ERP portal.\n\nRegards,\nOffice of the Registrar\nGTBIT, New Delhi`
  }
];

// Enrich additional emails with default fields if missing
const completeAdditional = additionalEmails.map(e => ({
  id: e.id,
  sender: e.sender,
  senderEmail: `${e.sender.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
  to: 'me <user@example.com>',
  subject: e.subject,
  snippet: e.snippet,
  body: e.body || `${e.snippet.replace(/^- /, '')}\n\nPlease let us know if you have any questions.\n\nBest regards,\n${e.sender}`,
  time: e.time,
  unread: e.unread ?? false,
  starred: e.starred ?? false,
  selected: false,
  hasCalendar: e.hasCalendar ?? false,
  hasUnsubscribe: e.hasUnsubscribe ?? false,
  category: e.category,
  folder: 'inbox',
  attachments: []
}));

const rawAllEmails = [...originalEmails, ...completeAdditional];

// Sort in descending chronological order
import { sortEmailsByDate } from './src/utils/dateUtils.js';
const allEmails = sortEmailsByDate(rawAllEmails);

console.log('Total emails in dataset:', allEmails.length);
console.log('Latest email:', allEmails[0].time, allEmails[0].sender);
console.log('Oldest email:', allEmails[allEmails.length - 1].time, allEmails[allEmails.length - 1].sender);

const fileContent = `export const INITIAL_EMAILS = ${JSON.stringify(allEmails, null, 2)};\n`;

const target1 = path.resolve('/home/joyboy/Desktop/gmail-clone/src/data/emails.js');
const target2 = path.resolve('/home/joyboy/.gemini/antigravity/scratch/gmail-clone/src/data/emails.js');

fs.writeFileSync(target1, fileContent, 'utf-8');
fs.writeFileSync(target2, fileContent, 'utf-8');

console.log('Updated', target1);
console.log('Updated', target2);
