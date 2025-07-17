import Lottie from "lottie-react";
import courseLoader from "./courseLoader.json"; // your animation file
const LoadingAnimations = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "150px",
      flexDirection: "column",
    }}
  >
    <Lottie
      animationData={courseLoader}
      loop={true}
      style={{ width: 300, height: 300 }}
    />
    {/* <p
    className="mx-auto md:text-[15px]"
    style={{
      marginTop: '1px',
      color: '#EC003F',
      fontSize: '1rem',
      fontWeight: 'bold',
    }}>
      Loading your awesome products...
    </p> */}
  </div>
);

export default LoadingAnimations;
