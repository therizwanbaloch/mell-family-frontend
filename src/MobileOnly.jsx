import { useEffect, useState } from "react";

export default function MobileOnly({ children }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Mobile Devices Only
          </h1>
          <p className="text-gray-600">
            Please open this website on a mobile device.
          </p>
        </div>
      </div>
    );
  }

  return children;
}