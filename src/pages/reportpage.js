import React, { useState, useEffect } from "react";
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import Footer from "../footer";
import { useLocation } from "react-router-dom";

export default function ReportPost() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [reportType, setReportType] = useState("");
  const [catchMessage, setCatchMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    isOpen: isSuccessOpen,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
  const {
    isOpen: isErrorOpen,
    onOpen: onOpenError,
    onClose: onCloseError,
  } = useDisclosure();
  const {
    isOpen: isCatchOpen,
    onOpen: onOpenCatch,
    onClose: onCloseCatch,
  } = useDisclosure();

  useEffect(() => {
    let timer;

    if (isSuccessOpen) {
      timer = setTimeout(() => {
        onCloseSuccess();
        setSuccessMessage("");
      }, 3000);
    }

    if (isErrorOpen) {
      timer = setTimeout(() => {
        onCloseError();
        setErrorMessage("");
      }, 3000);
    }

    if (isCatchOpen) {
      timer = setTimeout(() => {
        onCloseCatch();
        setCatchMessage("");
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  });

  const location = useLocation();
  const { author, postName } = location.state || {};

  const handleReportTypeChange = (value) => {
    if (value && value !== "") {
      document.getElementById("reportType").classList.remove("select-error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType || reportType === "") {
      document.getElementById("reportType").classList.add("select-error");
      setErrorMessage("Please select a reason for reporting.");
      onOpenError();
      return;
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/report`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          query,
          reportType,
          author,
          postName,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Thank you for Reporting");
        onOpenSuccess();
      } else {
        setErrorMessage("Please fill out all the fields.");
        onOpenError();
      }
    } catch (error) {
      setCatchMessage("Error submitting form: " + error.message);
      onOpenCatch();
    }
  };

  return (
    <>
      <form className="report" onSubmit={handleSubmit}>
        {isSuccessOpen && (
          <Alert
            status="success"
            variant="subtle"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="80px"
            colorScheme="red"
            borderRadius="10px"
            fontSize="small"
            gap={'5px'}
          >
            <AlertIcon color={"#6dcaae"} boxSize="30px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {successMessage}
            </AlertTitle>
          </Alert>
        )}

        {isErrorOpen && (
          <Alert
            status="error"
            variant="subtle"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="80px"
            colorScheme="red"
            borderRadius="10px"
            fontSize="small"
            gap={'5px'}
          >
            <AlertIcon color={"#d83030"} boxSize="30px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {errorMessage}
            </AlertTitle>
          </Alert>
        )}

        {isCatchOpen && (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="80px"
            colorScheme="red"
            borderRadius="10px"
            fontSize="small"
            gap={'5px'}
          >
            <AlertIcon color={"#d83030"} boxSize="30px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {catchMessage}
            </AlertTitle>
          </Alert>
        )}

        <h1>Report Content</h1>
        <input
          style={{ color: "#98bdf7", cursor: "not-allowed" }}
          className="disabled-input"
          type="text"
          value={author}
          disabled
        />

        <input
          style={{ color: "#98bdf7", cursor: "not-allowed" }}
          className="disabled-input"
          type="text"
          value={postName}
          disabled
        />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
        />

        <select
          id="reportType"
          value={reportType}
          onChange={(ev) => {
            setReportType(ev.target.value);
            handleReportTypeChange(ev.target.value);
          }}
          required
        >
          <optgroup>
            <option disabled value="">
              Why are you reporting this?
            </option>
            <option>It's spam</option>
            <option>Nudity or sexual content</option>
            <option>Hate speech</option>
            <option>Violence content</option>
            <option>Dangerous content</option>
            <option>Sale of illegal goods</option>
            <option>Intellectual property</option>
            <option>Drugs</option>
            <option>False information</option>
            <option>Scam or fraud</option>
          </optgroup>
        </select>

        <textarea
          type="text"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <div className="report-div">
        <h3>Reporting Guidelines</h3>
        <p>
          If you believe that content on our platform violates our community
          guidelines, please report it to us. We take reports seriously and will
          review them carefully. However, we kindly ask that you only report
          content that you genuinely believe violates our guidelines.Your
          cooperation helps us maintain a safe and respectful environment for
          everyone.
        </p>
        <h3>Community Guidelines</h3>
        <p>
          Create respectful content - no explicit or offensive material, support
          for illegal activities, or piracy links. Respect user privacy, engage
          in civil communication, and report violations for a positive
          community. Violations may lead to content removal or account actions.
        </p>
        <h3>Action Upon Violation</h3>
        <p>
          When a report matches our guidelines and we find that a user has
          violated our community guidelines, we will take appropriate action.
          Content violating guidelines will be removed also repeat offenders may
          face account restrictions or bans.We strive to maintain a safe and
          respectful community and appreciate your cooperation in upholding
          these standards.
        </p>
        <Footer />
      </div>
    </>
  );
}
