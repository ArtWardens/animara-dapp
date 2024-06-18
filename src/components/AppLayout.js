import { Outlet } from "react-router-dom";
import NavbarV2 from "./NavbarV2";
import FooterV2 from "./FooterV2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppLayout() {
  return (
    <div>
      {/* <NavbarV2 /> */}
      <main>
        <Outlet />
      </main>
      {/* <FooterV2 /> */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default AppLayout;
