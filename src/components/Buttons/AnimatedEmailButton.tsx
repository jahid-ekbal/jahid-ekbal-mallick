export default function AnimatedEmailButton() {
  // Pre-configured email details
  const email = "jahidekbalmallick@gmail.com";
  const subject = encodeURIComponent("Project Hire / Paid Discussion");
  const body = encodeURIComponent(
    "Hi Jahid,\n\nI came across your profile and would like to initiate a discussion regarding a paid engagement/hire project.\n\nHere are some brief details:\n- Project Type:\n- Estimated Timeline:\n\nLooking forward to your response!\n\nBest regards,",
  );

  // Deep link to force open Gmail compose window directly
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

  return (
    <a
      href={gmailHref}
      target="_blank"
      rel="noopener noreferrer"
      className="">
      {/* Animated Icon Wrapper */}
      <span className="relative flex h-5 w-6 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6 transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
          {/* Main Envelope Body */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>

        {/* Decorative Notification Ping Effect */}
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
        </span>
      </span>

      {/* Button Text
      <span className="tracking-wide">Hire Me / Paid Discussion</span> */}
    </a>
  );
}
