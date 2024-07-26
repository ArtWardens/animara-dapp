import React, { useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
  width: 110,
  height: 110,
  margin: 5,
  type: "svg",
  // data: "https://example.com",
  dotsOptions: {
    color: "black",
  },
  cornersSquareOptions: {
    color: "#FFB23E",
    type: "extra-rounded",
  },
  cornersDotOptions: {
    color: "black",
  },
  backgroundOptions: {
    color: "transparent",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    // margin: 0,
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

StyledQRCode.propTypes = {
  value: PropTypes.string,
  image: PropTypes.object,
}

export default StyledQRCode;
