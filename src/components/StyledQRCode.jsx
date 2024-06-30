import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  margin: 10,
  type: "svg",
  data: "https://example.com",
  dotsOptions: {
    color: "white",
    type: "dots",
  },
  cornersSquareOptions: {
    color: "#a63dff",
    type: "extra-rounded",
  },
  cornersDotOptions: {
    color: "white",
    type: "dot",
  },
  backgroundOptions: {
    color: "transparent",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10,
  },
});

const StyledQRCode = ({ value, image }) => {
  const qrRef = useRef(null);

  useEffect(() => {
    qrCode.update({
      data: value,
      image: image,
    });
    qrCode.append(qrRef.current);
  }, [value, image]);

  return <div ref={qrRef} />;
};

export default StyledQRCode;
