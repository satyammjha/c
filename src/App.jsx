import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './customComponents/Navbar/Navbar';
import ErrorPage from './pages/ErrorPage';
import { Footer } from './customComponents/Footer';
import ResumeReview from './pages/ResumeReview';
import Blogs from './pages/Blogs';
import Refferal from './pages/Refferal';
import Onboard from './pages/Onboard';
import JobDetails from './pages/JobDetails';
import { FloatingDockDemo } from './customComponents/FloatingNav';
import { SavedJobsProvider } from './Context/SavedJobContext';
import SavedJobs from './pages/Track';
import { ChatPopup } from './customComponents/Chatbot/chatbot';
import useUserData from './Context/UserContext';
import { MatchedJobsContext } from './Context/MatchedJobs';
import { FeedbackDrawer } from './customComponents/Feedback';
function App() {
  const { email } = useUserData();
  console.log("emm2", email);
  return (
      <SavedJobsProvider>
       
        <div className="dark:bg-black hide-scrollbar">
          <div className="fixed top-0 left-0 w-full z-50">
            <Navbar />
            <FeedbackDrawer />
            <FloatingDockDemo />
          </div>
          <ChatPopup />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ref/:referralCode" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reviewresume" element={<ResumeReview />} />
              <Route path="/tracker" element={<SavedJobs />} />
              <Route path="/blog" element={<Blogs />} />
              <Route path="/refferals" element={<Refferal />} />
              <Route path="/onboard/refer" element={<Onboard />} />
              <Route path="/job-details/:jobId" element={<JobDetails />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>

          <div className="z-50">
            <Footer />
          </div>
        </div>
      </SavedJobsProvider>
  )
}

export default App;