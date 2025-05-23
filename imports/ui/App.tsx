import React from 'react';
import { Navigate, Outlet, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { AdminLogin } from './AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import Analytics from './admin/Analytics';
import WPSFramework from './admin/WPSFramework';
import SurveyTheme from './admin/SurveyTheme';
import Setting from './admin/Setting';
import Welcome from './Welcome';
import SurveyWelcome from './SurveyWelcome';
import GetToKnowYou from './GetToKnowYou';
import SurveyQuestion from './SurveyQuestion';
import SectionIntro from './SectionIntro';
import { useTracker } from 'meteor/react-meteor-data';
import { SurveyThemes } from '/imports/api/surveyThemes';
import LeadershipManagement from './user/LeadershipManagement';
import TermsOfUse from './TermsOfUse';
import PrivacyNotice from './PrivacyNotice';
import AdminQuestionBank from './admin/AdminQuestionBank';
import UserQuestionBank from './user/UserQuestionBank';
import AllQuestions from './admin/AllQuestions';
import Bank from './admin/Bank';
import SurveyPage from './admin/Survey';
import PublicSurveyPage from './PublicSurveyPage';
import SurveyGoalsPage from './admin/SurveyGoals';
import AllSurveys from './admin/AllSurveys';
import SurveyBuilder from './admin/SurveyBuilder';
import { BrowserRouter as Router } from 'react-router-dom';
import QuestionBuilder from './admin/QuestionBuilder';
import SurveyPublic from './public/SurveyPublic';
import SurveyResponses from './admin/SurveyResponses';
import LogoutPage from './LogoutPage';

function RequireAdminAuth() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_jwt') : null;
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }
  return <Outlet />;
}

function RequireAuth() {
  const [checking, setChecking] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean|null>(null);
  const token = localStorage.getItem('jwt');
  const path = window.location.pathname;

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    Meteor.call('auth.getOnboardingStatus', (err: any, res: any) => {
      if (err) {
        setOnboardingComplete(false);
      } else {
        setOnboardingComplete(!!(res && res.onboardingComplete));
      }
      setChecking(false);
    });
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (checking) {
    return null; // Or a spinner/loading
  }
  // Allow access to onboarding page without the flag
  if (!onboardingComplete && path !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  // Prevent onboarding page access if already completed
  if (onboardingComplete && path === '/onboarding') {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}

// Wrapper for Section Intro, uses Meteor/react-meteor-data to fetch section info
import { useParams } from 'react-router-dom';

const SectionIntroWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { sectionIdx } = useParams<{ sectionIdx: string }>();
  const idx = Number(sectionIdx) || 0;
  const surveyThemes = useTracker(() => {
    Meteor.subscribe('surveyThemes.all');
    return SurveyThemes.find().fetch();
  }, []);
  const theme = surveyThemes[idx];
  if (!theme) return null;
  return (
    <SectionIntro
      title={theme.name}
      description={theme.description}
      onContinue={() => navigate(`/survey/section/${idx}/question/0`)}
      onBack={idx > 0 ? () => navigate(`/survey/section/${idx - 1}`) : undefined}
    />
  );
};

// Wrapper for Survey Question, placeholder for now
const SurveyQuestionWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { sectionIdx, questionIdx } = useParams<{ sectionIdx: string; questionIdx: string }>();
  const sIdx = Number(sectionIdx) || 0;
  const qIdx = Number(questionIdx) || 0;
  // TODO: Replace with real questions length
  const questionsLength = 4;
  return (
    <SurveyQuestion
      question="How often does your manager provide clear direction for your work?"
      progress={`${qIdx + 1}/${questionsLength}`}
      onNext={() => {}}
      onBack={qIdx > 0 ? () => navigate(`/survey/section/${sIdx}/question/${qIdx - 1}`) : () => navigate(`/survey/section/${sIdx}`)}
    />
  );
};


const PreviewSurvey: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  // You can keep your data loading logic if you want to show a fallback for missing tokens/data
  if (!token) return <div style={{textAlign:'center',marginTop:80}}>No preview token provided.</div>;
  // If you want to check for preview data in localStorage, do it here (optional)
  // Otherwise, just render SurveyPublic for the preview flow

  return <SurveyPublic />;
};

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<AdminLogin onAdminAuth={() => navigate('/admin/dashboard')} />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/preview/survey/:token" element={<PreviewSurvey />} />
      <Route path="/survey/:surveyId" element={<PublicSurveyPage />} />
      <Route path="/survey/public/:token" element={<SurveyPublic />} />
      <Route path="/survey/section/:sectionIdx" element={<SectionIntroWrapper />} />
      <Route path="/survey/section/:sectionIdx/question/:questionIdx" element={<SurveyQuestionWrapper />} />
      <Route path="/leadership" element={<LeadershipManagement />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/privacy" element={<PrivacyNotice />} />
      <Route path="/admin" element={<AdminLogin onAdminAuth={() => navigate('/admin/dashboard')} />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin-login" element={<AdminLogin onAdminAuth={() => navigate('/admin/questions')} />} />
      <Route element={<RequireAdminAuth />}>
         <Route path="/admin/surveys" element={<SurveyPage />} />
         <Route path="/admin/surveys/goals" element={<SurveyGoalsPage />} />
        <Route path="/admin/surveys/all" element={<AllSurveys />} />
        <Route path="/admin/surveys/responses" element={<SurveyResponses />} />
        <Route path="/admin/surveys/builder" element={<SurveyBuilder />} />
        <Route path="/admin/surveys/builder/:surveyId" element={<SurveyBuilderWrapper />} />
        <Route path="/admin/questions" element={<AdminQuestionBank />} />
<Route path="/user/questions" element={<UserQuestionBank />} />
        <Route path="/admin/questions/all" element={<AllQuestions />} />
        <Route path="/admin/questions/builder" element={<QuestionBuilder />} />
        <Route path="/admin/bank" element={<Bank />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/setting" element={<Setting />} />
        <Route path="/admin/surveys/wps-framework" element={<WPSFramework />} />
        <Route path="/admin/surveys/theme" element={<SurveyTheme />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => (
  <Router>
    <AppRoutes />
  </Router>
);

// Wrapper for SurveyBuilder to extract :id param
const SurveyBuilderWrapper: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  return <SurveyBuilder editId={surveyId} />;
};

export default App;
