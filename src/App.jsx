import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import Blog from "./pages/Blog/Blog";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound/NotFound";
import Carers from "./pages/Carers/Carers";
import Churches from "./pages/ChurchesMessage";
import TrainingAndResourcing from "./pages/TrainingAndResourcing/TrainingAndResourcing";
import PublicSpeaking from "./pages/PublicSpeaking/PublicSpeaking";
import Auth from "./pages/Auth/Auth";
import Main from "./Components/Main";
import { useEffect, useState } from "react";
import { auth, firestore } from "./firebase/config";
import { setAdmin, setNotificationCount } from "./redux/admin/actions";
import { setUser } from "./redux/user/actions";
import { setQoutes } from "./redux/common/actions";
import DashboardLayout from "./componentz/admin/DashboardLayout/Layout";
import { OnCreateUserProfileDocument } from "./firebase/auth";
import Spinner from "./componentz/Spinner/Spinner";
import Gallery from "./pages/admin/Gallery/Gallery";
import Quote from "./pages/admin/Quote/Quote";
import Draft from "./pages/admin/Draft/Draft";
import Event from "./pages/admin/Event/Event";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import CreatePost from "./pages/admin/CreatePost/CreatePost";
import Trash from "./pages/admin/Trash/Trash";
import Inbox from "./pages/admin/Inbox/Inbox";
import Published from "./pages/admin/Published/Published";
import Programmes from "./Components/Programs/Programmes";
import About from "./Components/About/About";
import Gallary from "./pages/Gallery/Gallery";

import "./App.scss";
import EditPost from "./pages/admin/EditPost/EditPost";

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children || null;
};

const App = () => {
  const admin = useSelector(({ user }) => user.admin);
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const OnFetchQuotes = () => {
    const quotesRef = firestore.collection("quotes");
    quotesRef.onSnapshot((snapShot) => {
      const quotes = [];
      snapShot.docs.forEach((item) => {
        quotes.push(item.data());
        quotes.length === snapShot.size && dispatch(setQoutes(quotes));
      });
    });
  };
  const CheckUser = () => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (pathname === "/oak-admin") {
        setLoading(true);
      }
      if (userAuth) {
        const userRef = await OnCreateUserProfileDocument(userAuth);
        userRef.onSnapshot((snapShot) => {
          if (snapShot.data().role === "admin") {
            const inboxRef = firestore.collection("inbox");
            inboxRef.where("seen", "==", false).onSnapshot((snapShot) => {
              dispatch(setNotificationCount(`${snapShot.size}`));
            });
            dispatch(
              setAdmin({
                id: snapShot.id,
                ...snapShot.data(),
              })
            );
          } else {
            dispatch(
              setUser({
                id: snapShot.id,
                ...snapShot.data(),
              })
            );
          }
          setLoading(false);
        });
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    CheckUser();
    OnFetchQuotes();
  }, []);
  return loading ? (
    <Spinner style={{ height: "100vh", width: "100vw" }} />
  ) : (
    <ScrollToTop>
      <Switch>
        <Route
          exact
          path={`/`}
          render={() => (
            <Main>
              <HomePage />
            </Main>
          )}
        />
        <Route
          exact
          path={`/carers`}
          render={() => (
            <Main>
              <Carers />
            </Main>
          )}
        />
        <Route
          exact
          path={`/gallery`}
          render={() => (
            <Main>
              <Gallary />
            </Main>
          )}
        />
        <Route
          exact
          path={`/churches`}
          render={() => (
            <Main>
              <Churches />
            </Main>
          )}
        />
        <Route
          exact
          path={`/training-and-resourcing`}
          render={() => (
            <Main>
              <TrainingAndResourcing />
            </Main>
          )}
        />
        <Route
          exact
          path={`/public-speaking`}
          render={() => (
            <Main>
              <PublicSpeaking />
            </Main>
          )}
        />
        <Route
          exact
          path={`/programmes`}
          render={() => (
            <Main>
              <Programmes />
            </Main>
          )}
        />

        <Route
          exact
          path={`/about`}
          render={() => (
            <Main>
              <About />
            </Main>
          )}
        />
        <Route
          path={`/blogs`}
          render={() => (
            <Main>
              <Blog />
            </Main>
          )}
        />
        <Route
          exact
          path="/oak-admin-auth"
          render={() => (admin ? <Redirect to="/oak-admin" /> : <Auth />)}
        />
        <Route
          exact
          path="/oak-admin"
          render={() =>
            admin ? (
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            ) : (
              <Redirect to="/oak-admin-auth" />
            )
          }
        />
        <Route
          exact
          path="/oak-admin/published"
          render={() =>
            admin ? (
              <DashboardLayout>
                <Published />
              </DashboardLayout>
            ) : (
              <Redirect to="/oak-admin-auth" />
            )
          }
        />
        <Route
          exact
          path="/oak-admin/inbox"
          render={() =>
            admin ? (
              <DashboardLayout>
                <Inbox />
              </DashboardLayout>
            ) : (
              <Redirect to="/oak-admin-auth" />
            )
          }
        />
        <Route
          path="/oak-admin/create-post"
          render={() =>
            !admin ? (
              <Redirect to={`/oak-admin-auth`} />
            ) : (
              <DashboardLayout>
                <CreatePost />
              </DashboardLayout>
            )
          }
        />
        <Route
          path="/oak-admin/edit-post"
          render={() =>
            !admin ? (
              <Redirect to={`/oak-admin-auth`} />
            ) : (
              <DashboardLayout>
                <EditPost />
              </DashboardLayout>
            )
          }
        />
        <Route
          path="/oak-admin/gallery"
          render={() =>
            !admin ? (
              <Redirect to={`/oak-admin-auth`} />
            ) : (
              <DashboardLayout>
                <Gallery />
              </DashboardLayout>
            )
          }
        />
        <Route
          path="/oak-admin/quotes"
          render={() =>
            !admin ? (
              <Redirect to={`/oak-admin-auth`} />
            ) : (
              <DashboardLayout>
                <Quote />
              </DashboardLayout>
            )
          }
        />
        <Route
          path="/oak-admin/events"
          render={() =>
            !admin ? (
              <Redirect to={`/oak-admin-auth`} />
            ) : (
              <DashboardLayout>
                <Event />
              </DashboardLayout>
            )
          }
        />
        <Route
          path="/oak-admin/draft"
          render={() =>
            !admin ? (
              <Redirect to={`/oak-admin-auth`} />
            ) : (
              <DashboardLayout>
                <Draft />
              </DashboardLayout>
            )
          }
        />
        <Route
          path="/oak-admin/trash"
          render={() =>
            !admin ? (
              <Redirect to={`/oak-admin-auth`} />
            ) : (
              <DashboardLayout>
                <Trash />
              </DashboardLayout>
            )
          }
        />
        <Route render={() => <NotFound />} />
      </Switch>
    </ScrollToTop>
  );
};

export default App;
