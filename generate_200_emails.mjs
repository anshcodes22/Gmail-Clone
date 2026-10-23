import fs from 'fs';
import path from 'path';
import { INITIAL_EMAILS as existing100 } from './src/data/emails.js';
import { sortEmailsByDate } from './src/utils/dateUtils.js';

console.log('Existing emails count:', existing100.length);

// 100 new realistic emails distributed across Oct, Sep, Aug, Jul
const new100Emails = [
  // --- OCTOBER 2026 ---
  {
    sender: 'Supabase',
    subject: 'Database Migration Completed: staging-auth schema applied',
    snippet: '- Automated migration script 20261019_users.sql executed in 420ms with 0 errors.',
    time: '2:15 PM',
    unread: true,
    starred: false,
    category: 'updates',
    body: `Hello Developer,\n\nYour automated database migration on project "app-staging" has completed successfully.\n\nMigration: 20261019_users.sql\nExecution Time: 420ms\nStatus: 14 tables verified, 2 foreign key constraints updated.\n\nCheck your project dashboard for full query execution logs.`
  },
  {
    sender: 'Vercel',
    subject: 'Deployment Succeeded: ansh-portfolio-v2.vercel.app (commit 8a2f19)',
    snippet: '- Preview deployment ready in 28 seconds. Edge middleware and static assets optimized.',
    time: '11:45 AM',
    unread: false,
    starred: true,
    category: 'updates',
    body: `Your project ansh-portfolio-v2 was deployed to production in 28 seconds.\n\nBranch: main\nCommit: 8a2f19 (Update projects showcase and testimonials)\nRegion: bom1 (Mumbai, India)\n\nInspect deployment at https://vercel.com/ansh/portfolio`
  },
  {
    sender: 'GitHub',
    subject: '[vercel/next.js] You were mentioned in discussion #64812: Turbopack caching',
    snippet: '- @ansh-puri thanks for the reproducible reproduction repository, investigating the issue now.',
    time: '10:12 AM',
    unread: true,
    starred: false,
    category: 'social',
    body: `@ansh-puri thanks for providing the minimal reproduction repository for Vite/Turbopack HMR caching behavior. We have assigned this to the compiler team for investigation in the next patch release.`
  },
  {
    sender: 'GTBIT Training & Placement',
    subject: 'TCS Digital & Prime Placement Drive: Eligibility Criteria & Test Format',
    snippet: '- Online national qualifier test on Oct 28. Review eligibility rules and coding syllabus.',
    time: 'Oct 19',
    unread: true,
    starred: true,
    hasCalendar: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-tcs-2026',
        name: 'TCS_Digital_Recruitment_Guidelines_2026.pdf',
        size: '1.4 MB',
        type: 'application/pdf'
      }
    ],
    body: `Dear Final Year Students,\n\nTata Consultancy Services (TCS) has announced their on-campus recruitment drive for the 2027 graduating batch under Digital and Prime packages.\n\nKey Dates:\n- Registration Closes: Oct 25, 2026\n- Online Assessment: Oct 28, 2026\n- Technical Interviews: Nov 3-5, 2026\n\nPlease find the attached PDF containing sample syllabus and previous year questions.\n\nRegards,\nTraining & Placement Cell\nGTBIT, New Delhi`
  },
  {
    sender: 'HDFC Bank',
    subject: 'Monthly E-Statement for Savings Account XX4821 - Period Ending 30-Sep-2026',
    snippet: '- Your monthly account statement is ready for viewing. Password is your 8-digit DOB.',
    time: 'Oct 19',
    unread: false,
    starred: false,
    category: 'updates',
    attachments: [
      {
        id: 'att-hdfc-sep26',
        name: 'HDFC_Account_Statement_Sep2026.pdf',
        size: '620 KB',
        type: 'application/pdf'
      }
    ],
    body: `Dear Customer,\n\nPlease find attached your Monthly Account Statement for Savings Account ending with 4821 for the period 01-Sep-2026 to 30-Sep-2026.\n\nClosing Balance: INR 48,290.50\nTotal Credits: INR 32,500.00\nTotal Debits: INR 18,740.00\n\nThe attached PDF statement is password protected.`
  },
  {
    sender: 'Swiggy',
    subject: 'Order Delivered: Biryani By Kilo - 1x Dum Gosht Biryani (Order #SWG-8921)',
    snippet: '- Your order was delivered hot and fresh by delivery executive Rahul Kumar.',
    time: 'Oct 18',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Amazon.in',
    subject: 'Dispatched: Logitech MX Master 3S Wireless Performance Mouse',
    snippet: '- Arriving tomorrow by 8 PM. Track your delivery live via Amazon app.',
    time: 'Oct 18',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Docker Hub',
    subject: 'Security Alert: Vulnerability scan completed for image webapp:latest',
    snippet: '- 0 Critical, 0 High vulnerabilities detected in base alpine-3.20 image.',
    time: 'Oct 17',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'LeetCode',
    subject: 'Daily Coding Challenge: Solve "Longest Palindromic Substring" to keep 45-day streak',
    snippet: '- Over 24,000 developers have submitted solutions today. Earn your October badge!',
    time: 'Oct 17',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'Flipkart',
    subject: 'Big Billion Days Sneak Peek: Early bird VIP passes for electronics',
    snippet: '- Up to 60% off on MacBooks, iPads, and Sony noise-cancelling headphones.',
    time: 'Oct 16',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'Sentry',
    subject: 'Resolved: 2 recurring JavaScript exceptions on production frontend',
    snippet: '- TypeError: Cannot read properties of undefined (reading "user") resolved by release v2.4.1.',
    time: 'Oct 16',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'LinkedIn Job Alerts',
    subject: '14 new Software Engineer roles matching "React Developer" in Delhi NCR',
    snippet: '- Companies hiring: Microsoft, Adobe, Swiggy, and 11 high-growth startups.',
    time: 'Oct 15',
    unread: true,
    starred: true,
    category: 'social'
  },
  {
    sender: 'GTBIT Dean Academics',
    subject: 'Notification: Submission of Capstone Project Mid-Term Progress Reports',
    snippet: '- All 4th year student teams must upload synopsis and GitHub repo by Oct 24.',
    time: 'Oct 15',
    unread: true,
    starred: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-capstone-guidelines',
        name: 'Capstone_Project_Midterm_Format.pdf',
        size: '890 KB',
        type: 'application/pdf'
      }
    ],
    body: `Dear Final Year Students,\n\nThe Academic Council requires all student teams enrolled in Minor and Major Capstone Projects to submit their Mid-Term Progress Report.\n\nSubmission Deadline: Oct 24, 2026\nMandatory fields: Problem statement, architectural diagram, technologies used, and test metrics.\n\nRegards,\nDean of Academics\nGTBIT, New Delhi`
  },
  {
    sender: 'Cloudflare',
    subject: 'Weekly Security & Performance Digest: 99.998% uptime on your custom domain',
    snippet: '- 182,400 requests served, 4,200 automated crawler requests blocked at edge.',
    time: 'Oct 14',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Apple Store',
    subject: 'Invoice for Apple Developer Program Annual Membership',
    snippet: '- Payment of INR 8,700 confirmed. Your iOS distribution certificates remain active.',
    time: 'Oct 14',
    unread: false,
    starred: false,
    category: 'updates',
    attachments: [
      {
        id: 'att-apple-inv',
        name: 'Apple_Developer_Program_Tax_Invoice.pdf',
        size: '340 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'Notion',
    subject: 'Team Wiki: 8 pages updated in "Engineering Best Practices"',
    snippet: '- New guides on Git commit conventions, PR reviews, and Docker multi-stage builds.',
    time: 'Oct 13',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Zomato Gold',
    subject: 'Exclusive Friday Dinner: Flat 30% off + 1+1 drinks in Cyber Hub Gurgaon',
    snippet: '- Reserve your priority table at top-rated microbreweries and pan-Asian dining.',
    time: 'Oct 13',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'Reddit',
    subject: 'Trending on r/programming: "Why SQLite in the browser is changing offline apps"',
    snippet: '- 1,240 upvotes and 380 comments on WebAssembly-powered embedded databases.',
    time: 'Oct 12',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    sender: 'Postman',
    subject: 'API Workspace Update: 6 new endpoints added to "Authentication Service"',
    snippet: '- OAuth2.0 PKCE flow, refresh token rotation, and rate limiter headers documented.',
    time: 'Oct 12',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Medium Daily Digest',
    subject: 'Top pick for you: "10 Advanced TypeScript Patterns used by Meta and Google"',
    snippet: '- Conditional types, template literal types, and type-level programming explained.',
    time: 'Oct 11',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'social'
  },
  {
    sender: 'MakeMyTrip',
    subject: 'Flight Booking Confirmed: New Delhi (DEL) to Bengaluru (BLR) on Nov 14',
    snippet: '- IndiGo 6E-2041 confirmed. PNR: ND82KL. Web check-in opens 48 hours prior.',
    time: 'Oct 11',
    unread: true,
    starred: true,
    category: 'updates',
    attachments: [
      {
        id: 'att-indigo-flight',
        name: 'IndiGo_E-Ticket_DEL_BLR.pdf',
        size: '512 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'Atlassian Jira',
    subject: '[SCRUM-104] Task assigned to you: "Implement JWT refresh token interceptor"',
    snippet: '- Priority: High. Story points: 5. Target release: Sprint 43.',
    time: 'Oct 10',
    unread: true,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Udemy',
    subject: 'Weekend Flash Sale: 200,000 top tech courses starting at just INR 449',
    snippet: '- Learn System Design, Microservices in Go, Rust, and AI Agent architectures.',
    time: 'Oct 10',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'GeeksforGeeks',
    subject: 'Campus Ambassador Program 2026-27: Application Shortlist Announcement',
    snippet: '- Congratulations! You have been selected for the round 2 technical discussion.',
    time: 'Oct 09',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    sender: 'Blinkit',
    subject: 'Order Delivered: 10-minute grocery run (Bread, Eggs, Filter Coffee beans)',
    snippet: '- Receipt #BLK-78190 delivered to A-Block Janakpuri.',
    time: 'Oct 09',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'State Bank of India',
    subject: 'YONO SBI: OTP for NetBanking login verification: 849201',
    snippet: '- Valid for 5 minutes. Do not share your OTP or banking credentials with anyone.',
    time: 'Oct 08',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Linear',
    subject: 'Weekly Cycle 14 Summary: 28 issues closed, 4 in progress',
    snippet: '- Team velocity increased by 18% with frontend component modularization.',
    time: 'Oct 08',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Spotify',
    subject: 'Your Release Radar: New electronic and lofi coding tracks for October',
    snippet: '- Listen to new tracks by Tycho, Bonobo, and fresh indie ambient artists.',
    time: 'Oct 07',
    unread: false,
    starred: false,
    category: 'promotions'
  },
  {
    sender: 'Datadog',
    subject: 'Monitors Alert: CPU utilization on redis-cache-node-01 normalized to 24%',
    snippet: '- Alert triggered at 03:15 AM recovered automatically after garbage collection.',
    time: 'Oct 07',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'GTBIT Examination Cell',
    subject: 'Notice: Re-evaluation and Verification of Answer Sheets for Even Semester 2026',
    snippet: '- Forms available on portal until Oct 18 with prescribed bank challan fee.',
    time: 'Oct 06',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'Tailwind Labs',
    subject: 'Introducing Tailwind CSS Oxide Engine: Up to 10x faster compile times',
    snippet: '- Learn how our unified Rust-powered core transforms build times across Vite and Next.js.',
    time: 'Oct 06',
    unread: false,
    starred: true,
    category: 'updates'
  },
  {
    sender: 'Discord',
    subject: 'Reactiflux Community: 12 unread announcements in #react-core and #jobs',
    snippet: '- Discussions on React Compiler release candidate and production performance.',
    time: 'Oct 05',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    sender: 'CRED',
    subject: 'Your credit score updated: 798 (Excellent). Discover pre-approved perks',
    snippet: '- Zero late payments in 24 months. Enjoy lower interest on lifestyle loans.',
    time: 'Oct 05',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'Uber',
    subject: 'Your Monday Morning Ride with Uber Auto: Trip Receipt INR 142.00',
    snippet: '- Picked up from Tilak Nagar Metro Station to GTBIT Campus.',
    time: 'Oct 04',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'HackerRank',
    subject: 'HackerRank Skill Test: 100% Score in React.js and REST APIs',
    snippet: '- Download your shareable verified certificate badge for recruitment profiles.',
    time: 'Oct 04',
    unread: true,
    starred: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-hackerrank-cert',
        name: 'HackerRank_React_Certificate.pdf',
        size: '780 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'Next.js Team',
    subject: 'Next.js 15 Release Candidate: Async Request APIs and Server Actions Stability',
    snippet: '- Full support for React 19, improved turbopack bundling, and self-hosted docker configs.',
    time: 'Oct 03',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Netflix',
    subject: 'Coming this weekend: Black Mirror Season 7 & Top Tech Documentaries',
    snippet: '- Watch on your TV, phone, or laptop in 4K Ultra HD audio.',
    time: 'Oct 03',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'Razorpay',
    subject: 'Payment Successful: INR 1,299 to JetBrains IntelliJ IDEA Subscription',
    snippet: '- Payment ID: pay_P82aK912. GST invoice available for download.',
    time: 'Oct 02',
    unread: false,
    starred: false,
    category: 'updates',
    attachments: [
      {
        id: 'att-razorpay-inv',
        name: 'Razorpay_GST_Invoice_P82aK.pdf',
        size: '420 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'IEEE Computer Society',
    subject: 'Webinar: Architecting Resilient Microservices with Kubernetes and Istio',
    snippet: '- Join Distinguished Engineer Dr. Sarah Chen from Google Cloud this Thursday.',
    time: 'Oct 02',
    unread: true,
    starred: false,
    hasCalendar: true,
    category: 'primary'
  },
  {
    sender: 'Prisma',
    subject: 'Prisma Accelerate: Global database caching and connection pooling live',
    snippet: '- Scale PostgreSQL connection limits effortlessly on AWS and Supabase.',
    time: 'Oct 01',
    unread: false,
    starred: false,
    category: 'updates'
  },

  // --- SEPTEMBER 2026 ---
  {
    sender: 'GTBIT Sports Committee',
    subject: 'Annual Inter-College Sports Fest 2026: Team Trials for Cricket & Football',
    snippet: '- Trials on Sept 29 at college sports ground. Register with your roll number.',
    time: 'Sep 30',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'Amazon Web Services',
    subject: 'AWS Billing Alert: Free Tier 85% limit reached for Amazon EC2 t3.micro',
    snippet: '- 637 hours out of 750 free hours used this billing cycle. Review active instances.',
    time: 'Sep 30',
    unread: true,
    starred: true,
    category: 'updates'
  },
  {
    sender: 'Coursera',
    subject: 'DeepLearning.AI: Generative AI with Large Language Models Certificate',
    snippet: '- Congratulations on completing the course! View your verified grade of 98.4%.',
    time: 'Sep 29',
    unread: true,
    starred: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-coursera-cert',
        name: 'DeepLearningAI_GenAI_Certificate.pdf',
        size: '1.1 MB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'Paytm',
    subject: 'Bill Payment Successful: BSES Rajdhani Electricity Bill INR 2,410.00',
    snippet: '- Transaction ID #PTM-981023. Cashback points added to your wallet.',
    time: 'Sep 28',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Kaggle',
    subject: 'Kaggle Grandmaster Notebook: "End-to-End RAG with LangChain & FAISS"',
    snippet: '- Ranked #1 in discussion this week with 540 upvotes. Fork and run the code directly.',
    time: 'Sep 28',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    sender: 'Swiggy Instamart',
    subject: 'Mid-week Midnight Munchies: 40% off on ice creams, chips and sodas',
    snippet: '- Free delivery in 12 minutes for Swiggy One members.',
    time: 'Sep 27',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'HashiCorp',
    subject: 'Terraform Cloud: Plan finished with 0 errors for workspace production-us-east',
    snippet: '- 8 resources modified, 0 destroyed. Approval required for auto-apply.',
    time: 'Sep 27',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'GTBIT Library',
    subject: 'Book Due Reminder: "Database System Concepts (Silberschatz)" due on Oct 03',
    snippet: '- Renew online via college OPAC portal to avoid late library penalty fees.',
    time: 'Sep 26',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'Zepto',
    subject: 'Order Delivered: 10-Minute Grocery Delivery Receipt #ZPT-84210',
    snippet: '- Organic Green Tea, Greek Yogurt, and Granola delivered to your doorstep.',
    time: 'Sep 26',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'GitHub Security',
    subject: 'Dependabot: 1 critical security vulnerability detected in package lodash',
    snippet: '- Automated PR #42 opened to bump lodash from 4.17.20 to 4.17.21.',
    time: 'Sep 25',
    unread: true,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'ICICI Bank',
    subject: 'Credit Card E-Statement: Total Amount Due INR 12,490.00 for Sep 2026',
    snippet: '- Due date: Oct 14, 2026. Pay easily using UPI or ICICI iMobile app.',
    time: 'Sep 25',
    unread: false,
    starred: false,
    category: 'updates',
    attachments: [
      {
        id: 'att-icici-sep',
        name: 'ICICI_Credit_Card_Statement_Sep26.pdf',
        size: '560 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'Zomato',
    subject: 'How was your order from Chai Point? Rate your piping hot ginger chai',
    snippet: '- Your feedback helps your delivery partner earn safety and performance incentives.',
    time: 'Sep 24',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Google Developer Student Clubs',
    subject: 'Solution Challenge 2026: Team Formation & Mentorship Kickoff',
    snippet: '- Build applications solving UN Sustainable Development Goals using Google Cloud.',
    time: 'Sep 24',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    sender: 'Stripe',
    subject: 'Payout Sent: INR 42,500.00 transferred to your linked bank account',
    snippet: '- Payout ID #po_1Oz941. Estimated funds arrival within 2 business days.',
    time: 'Sep 23',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'X (formerly Twitter)',
    subject: 'Top tech tweets this week: Discussions on Bun 1.2 vs Node.js 24 benchmarks',
    snippet: '- Read insights from core team maintainers on runtime memory footprint.',
    time: 'Sep 23',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    sender: 'BookMyShow',
    subject: 'Coldplay India Tour 2026: Extra Stadium Shows Added in Mumbai & Ahmedabad',
    snippet: '- Exclusive queue registration opens tomorrow at 12:00 PM IST on BookMyShow app.',
    time: 'Sep 22',
    unread: false,
    starred: true,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'GTBIT Department of ECE',
    subject: 'Guest Lecture on "5G Network Slicing and Edge Computing Architectures"',
    snippet: '- Date: Sept 25 in Auditorium-2. Guest speaker: Principal Architect at Ericsson.',
    time: 'Sep 22',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'DigitalOcean',
    subject: 'Monthly Invoice for Droplet "staging-backend-ubuntu-24" (INR 540.00)',
    snippet: '- Payment processed successfully via credit card. Download receipt PDF.',
    time: 'Sep 21',
    unread: false,
    starred: false,
    category: 'updates',
    attachments: [
      {
        id: 'att-do-invoice',
        name: 'DigitalOcean_Invoice_Sep2026.pdf',
        size: '280 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'LeetCode',
    subject: 'Weekly Contest 416 Ranking: Global Rank 412 out of 28,000 participants',
    snippet: '- Rating increased to 1,942 (Top 3.8%). Check problem 4 editorial explanation.',
    time: 'Sep 21',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    sender: 'Dominos Pizza',
    subject: 'Mid-Month Cravings: Buy 1 Get 1 Free on all Medium Cheese Burst Pizzas',
    snippet: '- Use code BOGO at checkout. Valid for delivery in under 30 minutes.',
    time: 'Sep 20',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'Figma',
    subject: 'Figma AI Features Early Access: Generate wireframes and color palettes in canvas',
    snippet: '- Your team workspace has been granted early beta access. Explore sample files.',
    time: 'Sep 20',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Postmark',
    subject: 'Transactional Email Health Alert: Delivery rate at 99.8% across 12,000 emails',
    snippet: '- Spam complaint rate remains well below 0.01%. Domain DKIM & DMARC verified.',
    time: 'Sep 19',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'LinkedIn',
    subject: 'Rohan Sharma and 2 others endorsed you for React, TypeScript, and Node.js',
    snippet: '- Your skills are visible to 1,500+ tech recruiters in your primary network.',
    time: 'Sep 19',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    sender: 'Decathlon India',
    subject: 'Monsoon Trekking Clearance: Up to 50% off on Quechua waterproof backpacks',
    snippet: '- High altitude tested gear with 10-year manufacturer warranty.',
    time: 'Sep 18',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'GTBIT Placement Cell',
    subject: 'Capgemini On-Campus Recruitment: Final Interview Shortlist & Schedule',
    snippet: '- Technical & HR interviews scheduled on Sep 22 at Training & Placement Block.',
    time: 'Sep 18',
    unread: true,
    starred: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-capgemini-list',
        name: 'Capgemini_Shortlisted_Students_GTBIT.pdf',
        size: '1.2 MB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'IRCTC',
    subject: 'E-Ticket Confirmation: Train 12004 New Delhi to Lucknow Shatabdi Express',
    snippet: '- PNR: 2481092144. Coach C3, Seat 42 (Window). Chart prepared.',
    time: 'Sep 17',
    unread: false,
    starred: true,
    category: 'updates',
    attachments: [
      {
        id: 'att-irctc-ticket',
        name: 'IRCTC_Electronic_Reservation_Slip.pdf',
        size: '480 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'Blinkit',
    subject: 'Delivered: Morning breakfast essentials (Brown Bread, Peanut Butter, Amul Milk)',
    snippet: '- Total paid INR 294 via Google Pay UPI. View electronic receipt.',
    time: 'Sep 17',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Uber',
    subject: 'Your trip with Uber Go: Janakpuri to Connaught Place INR 310.00',
    snippet: '- Thank you for riding with driver partner Amit Singh. Rating: 5.0 stars.',
    time: 'Sep 16',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Apple',
    subject: 'Apple Event Highlights: iPhone 18 Pro with A20 Bionic and M4 Max MacBooks',
    snippet: '- Pre-orders begin this Friday. Trade in your eligible device for instant credit.',
    time: 'Sep 16',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'Google Developer Groups',
    subject: 'DevFest New Delhi 2026: Speaker Lineup & Registration Confirmation',
    snippet: '- Join 1,200 developers on Oct 12 for hands-on sessions in Cloud, Web, and AI.',
    time: 'Sep 15',
    unread: true,
    starred: true,
    hasCalendar: true,
    category: 'primary'
  },

  // --- AUGUST 2026 ---
  {
    sender: 'GTBIT Academic Registrar',
    subject: 'Class Timetable & Faculty Advisor Allocation for Odd Semester 2026-27',
    snippet: '- Final weekly timetable for CSE Section A & B uploaded to college ERP.',
    time: 'Aug 31',
    unread: true,
    starred: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-gtbit-timetable',
        name: 'CSE_7th_Sem_Timetable_2026.pdf',
        size: '950 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'Smart India Hackathon',
    subject: 'SIH 2026: Problem Statements Announced across 48 Ministry domains',
    snippet: '- Form internal teams of 6 members with mandatory 1 female participant.',
    time: 'Aug 30',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'Groww',
    subject: 'Monthly Investment Report: August 2026 Portfolio Return +4.2%',
    snippet: '- Nifty 50 and Midcap Index SIPs executed successfully on Aug 05.',
    time: 'Aug 29',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Amazon.in',
    subject: 'Delivered: "Designing Data-Intensive Applications" by Martin Kleppmann',
    snippet: '- Package handed directly to resident. Rate your delivery experience.',
    time: 'Aug 28',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Swiggy',
    subject: 'Swiggy Dineout Great Indian Restaurant Festival: Flat 50% Off Food Bills',
    snippet: '- Book your dining slot at 5-star hotels and luxury cafes across Delhi NCR.',
    time: 'Aug 26',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'Postman',
    subject: 'Postman Student Expert Badge: Congratulations on completing API certification!',
    snippet: '- You mastered REST APIs, test scripts, and mock servers. Share your digital badge.',
    time: 'Aug 25',
    unread: true,
    starred: true,
    category: 'primary'
  },
  {
    sender: 'GitHub',
    subject: 'Your GitHub Pro student developer pack has been renewed for 2 years',
    snippet: '- Free access to GitHub Copilot, JetBrains IDEs, and $100 DigitalOcean credits.',
    time: 'Aug 24',
    unread: true,
    starred: true,
    category: 'updates'
  },
  {
    sender: 'Zerodha',
    subject: 'CDSL Easiest PIN Authentication Notification for Trading Account #ZR8921',
    snippet: '- E-voting and annual general meeting notice for Infosys & TCS shares.',
    time: 'Aug 23',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Zomato',
    subject: 'Order Confirmation: Haldirams - Chole Bhature & Raj Kachori (Delivered)',
    snippet: '- Receipt #ZOM-48921 paid via PhonePe UPI INR 340.00.',
    time: 'Aug 22',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Microsoft Learn',
    subject: 'Microsoft Azure Fundamentals (AZ-900) Virtual Training Days Invitation',
    snippet: '- Free attendance + 50% discount voucher for the official certification exam.',
    time: 'Aug 20',
    unread: true,
    starred: false,
    hasCalendar: true,
    category: 'primary'
  },
  {
    sender: 'Blinkit',
    subject: 'Invoice: Order #BLK-68210 (Protein bars, dark roast coffee, almond milk)',
    snippet: '- Total paid INR 480 via UPI. Download GST tax invoice.',
    time: 'Aug 19',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Uber',
    subject: 'Your Independence Day Long Weekend Uber Intercity Receipt: Delhi to Agra',
    snippet: '- Distance: 210 km. Total fare INR 3,240.00. Rating: 5 stars.',
    time: 'Aug 16',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'GTBIT Cultural Committee',
    subject: 'Independence Day Flag Hoisting Ceremony & Cultural Program Schedule',
    snippet: '- Ceremony begins Aug 15 at 9:00 AM in College Central Courtyard.',
    time: 'Aug 14',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'Coursera',
    subject: 'Google Cloud Platform: Architecting with Google Kubernetes Engine completed',
    snippet: '- Verify your completed coursework and professional specialization credentials.',
    time: 'Aug 12',
    unread: true,
    starred: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-gcp-cert',
        name: 'GCP_Kubernetes_Specialization_Cert.pdf',
        size: '1.3 MB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'Decathlon',
    subject: 'Independence Day Sale: Flat 30% off on running shoes and gym apparel',
    snippet: '- Kalenji running shoes tested for 1000km road runs with cushioned soles.',
    time: 'Aug 11',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'HDFC Bank',
    subject: 'Security Alert: NetBanking password successfully updated on Aug 09',
    snippet: '- If you did not initiate this change, contact HDFC phonebanking immediately.',
    time: 'Aug 09',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Spotify',
    subject: 'Your Summer 2026 Rewind: Top songs and favorite podcasts',
    snippet: '- You spent 4,200 minutes listening to Lo-fi beats while coding.',
    time: 'Aug 08',
    unread: false,
    starred: false,
    category: 'social'
  },
  {
    sender: 'HackerRank',
    subject: 'Skill Badge Earned: Problem Solving (Intermediate) Verification Complete',
    snippet: '- Added to your public profile. Shareable link generated for LinkedIn.',
    time: 'Aug 06',
    unread: false,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'Swiggy',
    subject: 'Hungry? Biryani, burgers, and rolls delivered to your college doorstep',
    snippet: '- Use coupon SWIGGYONE for zero delivery fee on orders above INR 149.',
    time: 'Aug 04',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'GTBIT Department of CSE',
    subject: 'Orientation & Introduction to High Performance Computing (HPC) Lab',
    snippet: '- All 4th year CSE students assigned computing cluster slots for ML workloads.',
    time: 'Aug 02',
    unread: true,
    starred: true,
    category: 'primary'
  },

  // --- JULY 2026 ---
  {
    sender: 'DigitalOcean',
    subject: 'Monthly Cloud Infrastructure Bill for July 2026 ($6.00 USD)',
    snippet: '- Invoice #DO-98214 paid via Visa card. View resource breakdown.',
    time: 'Jul 31',
    unread: false,
    starred: false,
    category: 'updates',
    attachments: [
      {
        id: 'att-do-jul',
        name: 'DigitalOcean_Invoice_Jul2026.pdf',
        size: '310 KB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'LeetCode',
    subject: 'Biweekly Contest 135: Problem 1-3 Solved in 42 minutes',
    snippet: '- Rating update: +28 points. Review master level solutions in discussion forum.',
    time: 'Jul 27',
    unread: true,
    starred: false,
    category: 'primary'
  },
  {
    sender: 'Zomato',
    subject: 'Rainy Day Special: Sizzling hot momos and thukpa delivered in 25 mins',
    snippet: '- Flat 40% off with code MONSOON on partner outlets in West Delhi.',
    time: 'Jul 23',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'Amazon.in',
    subject: 'Amazon Prime Day 2026: Biggest savings on SSDs, RAM, and mechanical keyboards',
    snippet: '- Exclusive 10% instant discount on ICICI and SBI credit cards.',
    time: 'Jul 19',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'GTBIT Examination Cell',
    subject: 'Declaration of End-Term Even Semester 2025-26 Examination Results',
    snippet: '- Semester 6 SGPA and CGPA results declared on GGSIPU student portal.',
    time: 'Jul 16',
    unread: true,
    starred: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-sem6-result',
        name: 'Even_Semester_6_Result_Gazette.pdf',
        size: '2.1 MB',
        type: 'application/pdf'
      }
    ]
  },
  {
    sender: 'State Bank of India',
    subject: 'Quarterly Savings Bank Interest Credited for Period Apr-Jun 2026',
    snippet: '- Interest amount of INR 342.00 credited to account ending 8412.',
    time: 'Jul 12',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'Uber',
    subject: 'Your Friday Night Ride with Uber Premier: Cyber City to Janakpuri',
    snippet: '- Distance 24.2 km. Total fare INR 482.00 paid via Paytm UPI.',
    time: 'Jul 10',
    unread: false,
    starred: false,
    category: 'updates'
  },
  {
    sender: 'MakeMyTrip',
    subject: 'Monsoon Getaways: Best luxury resort stays in Shimla, Manali & Rishikesh',
    snippet: '- Flat 25% off on hillside cottages and river rafting boutique stays.',
    time: 'Jul 06',
    unread: false,
    starred: false,
    hasUnsubscribe: true,
    category: 'promotions'
  },
  {
    sender: 'GTBIT Training & Placement',
    subject: 'Summer Internship Completion Certificate & Report Submission Notice',
    snippet: '- Submit your company certificate and 20-page internship report to departmental coordinator.',
    time: 'Jul 04',
    unread: true,
    starred: true,
    category: 'primary',
    attachments: [
      {
        id: 'att-intern-report-fmt',
        name: 'Summer_Internship_Report_Format.pdf',
        size: '1.1 MB',
        type: 'application/pdf'
      }
    ]
  },
  {
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

// Enrich new emails with complete standard fields
const enrichedNew = new100Emails.map((e, idx) => ({
  id: (101 + idx).toString(),
  sender: e.sender,
  senderEmail: `${e.sender.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
  to: 'me <user@example.com>',
  subject: e.subject,
  snippet: e.snippet,
  body: e.body || `${e.snippet.replace(/^- /, '')}\n\nPlease reach out if you have any questions.\n\nBest regards,\n${e.sender}`,
  time: e.time,
  unread: e.unread ?? false,
  starred: e.starred ?? false,
  selected: false,
  hasCalendar: e.hasCalendar ?? false,
  hasUnsubscribe: e.hasUnsubscribe ?? false,
  category: e.category || 'primary',
  folder: 'inbox',
  attachments: e.attachments || []
}));

// Combine existing 100 emails + 100 new emails = 200 emails
const combined = [...existing100, ...enrichedNew];

// Re-assign distinct sequential IDs 1 to 200 and sort chronologically descending
const sorted = sortEmailsByDate(combined);
const all200Emails = sorted.map((e, index) => ({
  ...e,
  id: (index + 1).toString()
}));

console.log('Total emails in final dataset:', all200Emails.length);
console.log('First email:', all200Emails[0].time, all200Emails[0].sender);
console.log('Last email:', all200Emails[all200Emails.length - 1].time, all200Emails[all200Emails.length - 1].sender);

const fileContent = `export const INITIAL_EMAILS = ${JSON.stringify(all200Emails, null, 2)};\n`;

const target1 = path.resolve('/home/joyboy/Desktop/gmail-clone-devu/gmail-clone/src/data/emails.js');
const target2 = path.resolve('/home/joyboy/Desktop/gmail-clone/src/data/emails.js');
const target3 = path.resolve('/home/joyboy/.gemini/antigravity/scratch/gmail-clone/src/data/emails.js');

fs.writeFileSync(target1, fileContent, 'utf-8');
fs.writeFileSync(target2, fileContent, 'utf-8');
fs.writeFileSync(target3, fileContent, 'utf-8');

console.log('Successfully written to:');
console.log('1.', target1);
console.log('2.', target2);
console.log('3.', target3);
