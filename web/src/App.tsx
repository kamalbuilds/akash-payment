import React, { lazy, Suspense, useEffect } from 'react';
import './style/app.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import SideNav from './components/SideNav';
import Keplr from './components/KeplrLogin';
import Logging from './components/Logging';
import Stack from '@mui/material/Stack';
import { useRecoilState } from 'recoil';
import { activeCertificate, keplrState } from './recoil/atoms';
import { getKeplr } from './_helpers/keplr-utils';
import { loadActiveCertificate } from './recoil/api';
import { useWallet } from './hooks/useWallet';
import Loading from './components/Loading';
import { getRpcNode, useRpcNode } from './hooks/useRpcNode';
import { Alert, Button } from '@mui/material';
import PaywithFiat from './pages/paywithfiat';
import DeployPage from './pages/donate-with-checkout/page';

// Lazy loading all pages in appropriate time
const DeploymentStepper = lazy(() => import('./components/DeploymentStepper'));
const Deployment = lazy(() => import('./components/Deployment'));
const ReDeploy = lazy(() => import('./pages/ReDeploy'));
const Settings = lazy(() => import('./pages/Settings'));
const MyDeployments = lazy(() => import('./pages/MyDeployments'));
const UpdateDeployment = lazy(() => import('./pages/UpdateDeployment'));
const CustomApp = lazy(() => import('./pages/CustomApp'));
const Provider = lazy(() => import('./pages/Provider'));
const Landing = lazy(() => import('./pages/Landing'));

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/landing');
  }, []);

  return <></>;
};

const DepricationNotice = () => {
  const message = 'joined forces, the Overclock core team is pausing active development and bug fixes for Console. Please use Cloudmos Deploy for your Akash Network deployments';
  const cloudmosUrl = 'https://deploy.cloudmos.io/';

  const handleCtaClick = () => {
    window.location.href = cloudmosUrl;
  };

  return <Alert severity='info'>
    <Stack alignItems="center">
      <div>
        Now that Cloudmos and Overclock labs have&nbsp;
        <a target="_blank" href="https://akash.network/blog/overclock-labs-joins-forces-with-cloudmos-to-advance-the-akash-supercloud/" rel="noreferrer">joined forces</a>,
        the Overclock core team is pausing active development and bug fixes for Console. Please use&nbsp;
        <a href="https://deploy.cloudmos.io/">Cloudmos Deploy</a>
        &nbsp;for your Akash Network deployments.
      </div>
      <div><Button onClick={handleCtaClick}>Go to Cloudmos</Button></div>
    </Stack>
  </Alert>;
};

const Help = () => {
  window.location.href = 'https://docs.akash.network/guides/deploy';

  return <></>;
};

const AppRouter = () => {
  return (
    <Router>
      <div className="console-container">
        <DepricationNotice />
        <SideNav>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/" element={<Welcome />} />
            <Route path="landing/node-deployment" element={<DeploymentStepper />} />
            <Route path="landing/ml-deployment" element={<DeploymentStepper />} />
            <Route path="landing/web-deployment" element={<DeploymentStepper />} />
            <Route path="new-deployment">
              <Route path=":folderName/" element={<DeploymentStepper />} />
              <Route path=":folderName/:templateId" element={<DeploymentStepper />} />
              <Route path=":folderName/:templateId/:intentId" element={<DeploymentStepper />} />
              <Route path="custom-sdl" element={<CustomApp />} />
              <Route path="custom-sdl/:intentId" element={<CustomApp />} />
            </Route>
            <Route path="/paywithfiat" element={<PaywithFiat />} />
            <Route path="/Deploy-with-checkout" element={<DeployPage />} />
            <Route path="configure-deployment/:dseq/" element={<DeploymentStepper />} />
            <Route path="provider/:providerId" element={<Provider />} />
            <Route path="my-deployments">
              <Route path="" element={<MyDeployments />} />
              <Route path=":dseq" element={<Deployment />} />
              <Route path=":dseq/update-deployment" element={<UpdateDeployment />} />
              <Route path=":dseq/re-deploy" element={<ReDeploy />} />
            </Route>
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Routes>
        </SideNav>
      </div>
    </Router>
  );
};

export default function App() {
  const [keplr, setKeplr] = useRecoilState(keplrState);
  const [certificate, setCertificate] = useRecoilState(activeCertificate);
  const { isConnected } = useWallet();
  const [getRpc] = useRpcNode();
  const rpcNode = getRpc();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const checkKeplr = async () => {

      if (isConnected && window.keplr && keplr.accounts.length > 0 && keplr.accounts[0].address) {
        const wallet = window.keplr.getOfflineSigner(rpcNode.chainId);

        try {
          const accounts = await wallet.getAccounts();

          // if the wallet's changed, update the atom
          if (accounts[0].address !== keplr.accounts[0].address) {
            setKeplr(await getKeplr());
            setCertificate(await loadActiveCertificate(accounts[0].address));
          } else if (certificate.$type === 'Invalid Certificate') {
            const activeCert = await loadActiveCertificate(keplr.accounts[0].address);

            if (activeCert.$type === 'TLS Certificate') {
              setCertificate(activeCert);
            }
          }
        } catch (err) {
          console.warn('unable to update keplr status', err);
        }
      }

      // schedule next check
      timer = setTimeout(checkKeplr, 2000);
    };

    // start polling
    checkKeplr();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isConnected, certificate, setCertificate, keplr, setKeplr]);

  return (
    <Logging>
      <Suspense
        fallback={
          <Stack direction="column">
            <Loading title="Loading" />
          </Stack>
        }
      >
        <Keplr>
          <AppRouter />
        </Keplr>
      </Suspense>
    </Logging>
  );
}
