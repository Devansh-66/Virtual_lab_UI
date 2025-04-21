import { Facebook, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { useRef, useEffect } from "react";

export default function Footer({ isDarkMode, setShowAccessSettings, onContentChange }) {
  const institutes = [
    "IIITHyderabad.png",
    "IITBombay.png",
    "IITDelhi.png",
    "IITGuwahati.png",
    "IITKanpur.png",
    "IITKharagpur.png",
    "IITRoorkee.png",
    "NITKSurathkal.png",
    "DEI.png",
    "COEPune.png",
    "AMRT.png",
  ];
  const names = [
    "IIIT Hyderabad",
    "IIT Bombay",
    "IIT Delhi",
    "IIT Guwahati",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Roorkee",
    "NITK Surathkal",
    "Dayalbagh Educational Institute",
    "College of Engineering Pune",
    "Academy of Scientific and Innovative Research",
  ];

    // Testimonials data with images
    const testimonials = [
      {
        quote:
          "Virtual Labs is the knowledge seed for the students of the science and technology domain. Such an astonishing platform would enlighten the learning path of the students before they move to the real lab for the experiments. The students may realize the look and feel of the real lab and optimize the efforts, time, and funds involved in performing the real labs. The best part of Virtual Labs is to use it with personal comfort and convenience.",
        author: "Dr. Pankaj K. Goswami",
        institution: "Amity University Uttar Pradesh, Lucknow",
        image:
          "https://media.licdn.com/dms/image/v2/C5603AQEz4GNlvwNlGA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1517372134268?e=1746662400&v=beta&t=Mh06vPGKdCx5fwlxNrYUtQ2YrUcVlRz3Bn8R8ih0m6k",
      },
      {
        quote:
          "One of the primary advantages associated with the utilization of Virtual Laboratory is the ability for students to engage in self-paced learning. This technology facilitates students in engaging in studying, preparing for, and doing laboratory experiments at their own convenience, regardless of time and location.",
        author: "Dr. Mohd Zubair Ansari",
        institution: "National Institute of Technology Srinagar",
        image: "https://nitsri.irins.org/assets/profile_images/166726.JPG",
      },
      {
        quote:
          "Virtual Labs are implemented in USAR, GGSIPU and are useful in understanding the theories and concepts of science or other subjects that cannot be studied alone only by textbooks. It has the great potential to enhance actual laboratory experiences. Furthermore, the best progressive learning and performance for real experiments appears when the virtual laboratory preceded paper-based practical experiments.",
        author: "Dr. Khyati Chopra",
        institution: "USAR GGSIPU",
        image:
          "https://media.licdn.com/dms/image/v2/D4D03AQHuC1JstRSJtw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1673016556042?e=1746662400&v=beta&t=Yor9lUizC2VvW7ez1y3l7vSpaMuRQZmYI7tk_i9WKmU",
      },
      {
        quote:
          "Virtual lab is a platform which provides an opportunity to understand the theoretical concept in very easy way with the help of simulator. Pretest and post-test feature provided make the self-assessment part easy for the students. This platform provides a wide range of experiments covering almost all kind of domain and it is very beneficial for the students. As a Nodal Coordinator of Virtual Lab for Chameli Devi Group of Institution, I am very much satisfied with virtual lab facility as it helps the students to engage more with self-learning path.",
        author: "Radheshyam Acholia",
        institution: "Chameli Devi Group of Institution, Indore",
        image:
          "https://media.licdn.com/dms/image/v2/C5103AQE9xJB5_a4SOg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1580972506276?e=1746662400&v=beta&t=autYorXIHOquPQWC91_uw4CKX-8Whj9ItyzGWLsT1po",
      },
    ];
  

  const scrollRef = useRef(null);
  const testimonialRef = useRef(null);

  useEffect(() => {
    const scrollContent = scrollRef.current;
    if (scrollContent) {
      let scrollAmount = 0;
      const speed = 1; // Adjusted speed for smooth scrolling
      const intervalTime = 20;

      // Calculate total width of duplicated content
      const totalWidth = scrollContent.scrollWidth / 2; // Since content is duplicated
      const containerWidth = scrollContent.parentElement.clientWidth;

      // Debug logging
      console.log("Institutes - Total Width:", totalWidth, "Container Width:", containerWidth);

      if (totalWidth > containerWidth) {
        const interval = setInterval(() => {
          scrollAmount += speed;
          if (scrollAmount >= totalWidth) {
            scrollAmount = 0; // Reset to start for seamless looping
          }
          scrollContent.style.transform = `translateX(-${scrollAmount}px)`;
          scrollContent.style.transition = `transform ${intervalTime / 1000}s linear`;
        }, intervalTime);

        return () => clearInterval(interval);
      }
    }
  }, []);

  useEffect(() => {
    const testimonialContent = testimonialRef.current;
    if (testimonialContent) {
      let scrollAmount = 0;
      const speed = 0.5; // Slower speed for testimonials
      const intervalTime = 20;

      // Calculate total width of duplicated content
      const totalWidth = testimonialContent.scrollWidth / 2; // Since content is duplicated
      const containerWidth = testimonialContent.parentElement.clientWidth;

      // Debug logging
      console.log("Testimonials - Total Width:", totalWidth, "Container Width:", containerWidth);

      if (totalWidth > containerWidth) {
        const interval = setInterval(() => {
          scrollAmount += speed;
          if (scrollAmount >= totalWidth) {
            scrollAmount = 0; // Reset to start for seamless looping
          }
          testimonialContent.style.transform = `translateX(-${scrollAmount}px)`;
          testimonialContent.style.transition = `transform ${intervalTime / 1000}s linear`;
        }, intervalTime);

        return () => clearInterval(interval);
      }
    }
  }, []);

  const getInitialsAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    return (
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold ${
          isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-300 text-gray-900"
        }`}
      >
        {initials}
      </div>
    );
  };

  return (
    <footer
      className={`w-full p-4 sm:p-6 md:p-8 border-t mt-auto transition-all duration-300 relative z-30 ${
        isDarkMode ? "bg-gray-900 text-gray-100 border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"
      }`}
    >
      {/* Contact and Institutes Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6">
        {/* Contact Details (Left Side) */}
        <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
          <div className="text-base sm:text-lg font-semibold mb-2">Contact Us</div>
          <p className="text-xs sm:text-sm">
            Wireless Research Lab
            <br />
            Room No - 206/IIA
            <br />
            Bharti School of Telecom
            <br />
            Indian Institute of Technology Delhi
            <br />
            Hauz Khas, New Delhi-110016, INDIA
          </p>
          <p className="text-xs sm:text-sm mt-2">
            Email: <a href="mailto:support@vlab.co.in" className="hover:underline">support@vlab.co.in</a> | Phone(L) - 011-26582050
          </p>
          <div className="mt-2">
            <img
              src="https://www.vlab.co.in/images/qr-code.png"
              alt="Virtual Labs QR Code"
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
          </div>
        </div>

        {/* Participating Institutes (Right Side with Scrolling) */}
        <div className="w-full sm:w-2/3">
          <div className="text-base sm:text-lg font-semibold mb-2 text-center">
            Participating Institutes
          </div>
          <div className="overflow-hidden w-full max-w-[80vw] sm:max-w-[70vw] md:max-w-3xl mx-auto py-2 sm:py-4">
            <div className="flex space-x-3 sm:space-x-4 md:space-x-6 min-w-max" ref={scrollRef}>
              {institutes.concat(institutes).map((logo, index) => (
                <div key={index} className="flex flex-col items-center flex-shrink-0">
                  <img
                    src={logo}
                    className="h-14 sm:h-16 md:h-20 object-contain"
                    alt={`Logo of ${names[index % names.length]}`}
                  />
                  <p className="text-xs sm:text-sm font-semibold text-center mt-1 sm:mt-2">
                    {names[index % names.length]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-semibold">About & Quick Links</h3>
          <ul className="mt-2 sm:mt-3 space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li>
              <button
                onClick={() => onContentChange("about")}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                About Us
              </button>
            </li>
            <li>
              <span
                className="hover:text-blue-500 hover:underline focus:ring-2 focus:ring-blue-500"
                title="Tracking of Virtual Labs usage"
                onClick={() =>
                  window.open(
                    "https://centraloutreach.vlabs.co.in/",
                    "_blank",
                    "noopener noreferrer"
                  )
                }
              >
                Outreach Portal
              </span>
            </li>
            <li>
              <span
                className="hover:text-blue-500 hover:underline focus:ring-2 focus:ring-blue-500"
                title="Systematic Assessment of Health care providers Knowledge and Training"
                onClick={() =>
                  window.open(
                    "https://www.sashakt-hwc.mohfw.gov.in/home",
                    "_blank",
                    "noopener noreferrer"
                  )
                }
              >
                Sashakt Portal
              </span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <h3 className="text-base sm:text-lg font-semibold">Legal & Policies</h3>
          <ul className="mt-2 sm:mt-3 space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li>
              <button
                onClick={() => onContentChange("terms")}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Terms & Conditions
              </button>
            </li>
            <li>
              <button
                onClick={() => onContentChange("privacy")}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <h3 className="text-base sm:text-lg font-semibold">User Support & Help</h3>
          <ul className="mt-2 sm:mt-3 space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li>
              <button
                onClick={() => onContentChange("help")}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Help Center
              </button>
            </li>
            <li>
              <button
                onClick={() => onContentChange("faq")}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                FAQs
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowAccessSettings(true)}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Accessibility Settings
              </button>
            </li>
            <li>
              <span
                className="hover:text-blue-500 hover:underline focus:ring-2 focus:ring-blue-500"
                title="National Mission in Education through ICT"
                onClick={() =>
                  window.open("https://nmeict.ac.in/", "_blank", "noopener noreferrer")
                }
              >
                NMEICT
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-4 sm:mt-6">
        <div className="text-base sm:text-lg font-semibold mb-2 text-center">Testimonials</div>
        <div className="overflow-hidden w-full max-w-[80vw] sm:max-w-[70vw] md:max-w-3xl mx-auto py-2 sm:py-4">
          <div className="flex space-x-2 sm:space-x-3 md:space-x-4 min-w-max" ref={testimonialRef}>
            {testimonials.concat(testimonials).map((testimonial, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-[80vw] sm:w-60 md:w-64 p-2 sm:p-3 md:p-4 shadow-md border transition-all duration-300 hover:shadow-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200 border-gray-700"
                    : "bg-gray-200 text-gray-900 border-gray-300"
                }`}
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      onError={(e) => (e.target.style.display = "none")} // Hide broken images
                    />
                  ) : (
                    getInitialsAvatar(testimonial.author)
                  )}
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm italic leading-relaxed relative">
                      <span className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 text-lg sm:text-xl text-gray-400 opacity-50">
                        "
                      </span>
                      {testimonial.quote.length > 150
                        ? `${testimonial.quote.substring(0, 150)}...`
                        : testimonial.quote}
                      <span className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 text-lg sm:text-xl text-gray-400 opacity-50">
                        "
                      </span>
                    </p>
                    <p className="text-sm sm:text-base font-semibold mt-1 sm:mt-2">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-gray-400">{testimonial.institution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center space-x-4 mt-4 sm:mt-6">
        <a
          href="#"
          className="hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </a>
        <a
          href="#"
          className="hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Twitter"
        >
          <Twitter size={20} />
        </a>
        <a
          href="#"
          className="hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
          aria-label="LinkedIn"
        >
          <Linkedin size={20} />
        </a>
        <a
          href="#"
          className="hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-label="GitHub"
        >
          <Github size={20} />
        </a>
        <a
          href="#"
          className="hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Email"
        >
          <Mail size={20} />
        </a>
      </div>
    </footer>
  );
}