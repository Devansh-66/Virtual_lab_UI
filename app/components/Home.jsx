"use client";

import React, { useEffect, useState } from "react";
import ShaderBackground from "./ShaderBackground";
import { ArrowLeft } from "lucide-react";

export default function Home({ isDarkMode = false, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const tabContent = {
    Overview: {
      title: "Overview",
      content: (
        <>
          <p className="text-sm leading-relaxed mb-4">
            Virtual Labs, an Ministry of Education project under NMEICT, offers free remote laboratory learning experiences. Workshops and nodal centers support institute partnerships within the Virtual Labs consortium. The project, led by IIT Delhi and involving eleven institutes, provides over 190 Virtual Labs and 1600+ web-enabled experiments across various domains using open-source technologies. These simulations are accessible online without any additional infrastructure or fees.
          </p>
          {/* Stakeholders Section */}
          <section className="mt-8">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              Stakeholders
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Student",},
                // img: "/Student.jpg"
                { name: "Faculty",},
                // img: "/Faculty.jpg"
                { name: "Subject Matter Experts", },
                // img: "/SME.jpg"
                { name: "Developers",},
                // img: "/Developers.jpg"
                { name: "Nodal Center Community",},
                //  img: "/MCC.jpg" 
                { name: "Participating Institutes",},
                // img: "/PI.jpg" 
                { name: "Interns",},
                //  img: "/Interns.jpg" 
                { name: "Ministry of Education", },
                // img: "/MoE.jpg"
                { name: "Accrediation Bodies",},
                // img: "/AB.jpg"
                { name: "Service Providers", },
                //  img: "/SP.jpg"
                { name: "Universities", },
                //  img: "/Universities.jpg"
                { name: "Researchers", },
                // img: "/Researchers.jpg"
              ].map((stakeholder) => (
                <div
                  key={stakeholder.name}
                  className={`p-3 rounded-lg text-center font-medium text-sm transition-all duration-300 shadow-sm relative overflow-hidden ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                  style={{
                    backgroundImage: `url(${stakeholder.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Overlay for better text readability */}
                  <div
                    className={`absolute inset-0 ${
                      isDarkMode ? "bg-black/50" : "bg-white/50"
                    } z-0`}
                  ></div>
                  <div className="relative z-10 h-40 content-center">{stakeholder.name}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      ),
    },
    "Goals and Philosophy": {
      title: "Goals and Philosophy",
      content: (
        <>
          <h3 className="text-base font-semibold mb-2">Goals</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              To offer a remote learning experience with simulated experiments in
              diverse areas of Science and Engineering.
            </li>
            <li>
              To engage students by sparking their curiosity, allowing them to
              learn fundamental and complex concepts through remote
              experimentation.
            </li>
            <li>
              To present a complete Learning Management System around the Virtual
              Labs, where students and teachers can utilize various tools for
              learning, including supplemental web-resources, video-lectures,
              animated demonstrations, and self-evaluation.
            </li>
          </ul>
          <h3 className="text-base font-semibold mt-4 mb-2">Philosophy</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              Bridging the gap for colleges that lack lab facilities: Provide
              online labs as a substitute for hands-on lab work in engineering
              colleges that do not have the necessary equipment.
            </li>
            <li>
              Enhancing existing labs with online resources: Expand the
              capabilities of existing labs with online labs to complement and
              augment the learning experience of engineering students.
            </li>
            <li>
              Empowering the educator through specialized workshops: Offer
              workshops on-site or online to enhance the skill set and proficiency
              of educators in the effective use of online labs in engineering
              education.
            </li>
          </ul>
        </>
      ),
    },
    "Participating Institutes": {
      title: "Participating Institutes",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { name: "Amrita Vishwa Vidyapeetham", img: "/AMRT.png" },
            { name: "COE Pune", img: "/COEPune.png" },
            { name: "Dayalbagh Educational Institute", img: "/DEI.png" },
            { name: "IIT Bombay", img: "/IITBombay.png" },
            { name: "IIT Delhi", img: "/IITDelhi.png" },
            { name: "IIT Guwahati", img: "/IITGuwahati.png" },
            { name: "IIT Kanpur", img: "/IITKanpur.png" },
            { name: "IIT Kharagpur", img: "/IITKharagpur.png" },
            { name: "IIT Roorkee", img: "/IITRoorkee.png" },
            { name: "IIIT Hyderabad", img: "/IIITHyderabad.png" },
            { name: "NITK Surathkal", img: "/NITKSurathkal.png" },
          ].map((institute) => (
            <div key={institute.name} className="flex flex-col items-center">
              <img
                src={institute.img}
                alt={institute.name}
                className="w-16 h-16 md:w-20 md:h-20 object-contain mb-2"
              />
              <p className="text-sm text-center">{institute.name}</p>
            </div>
          ))}
        </div>
      ),
    },
    Testimonials: {
      title: "Testimonials",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
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
          ].map((testimonial, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <p className="text-sm italic mb-2">
                <img
                  src={testimonial.image}
                  className="w-12 h-12 rounded-full mb-2"
                />{" "}
                - {testimonial.author}
                <br />
                {testimonial.institution}
              </p>
              <p className="text-sm italic mb-2">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      ),
    },
    FAQ: {
      title: "Frequently Asked Questions",
      content: (
        <div className="space-y-2">
          {[
            {
              question: "What are Virtual Labs?",
              answer:
                "Virtual Labs are intended to augment the learning of science and engineering subjects through performing experiments. The experiments are designed either as simulations or as remote triggered. A remote triggered lab allows a user to connect to real equipment using a web browser. There are currently around 150 labs and 1500 experiments at various stages of development and deployment. They are currently hosted at vlabs. Virtual Labs is an initiative of Ministry of Human Resources, India.",
            },
            {
              question: "What are the objectives of the Virtual Labs?",
              answer:
                "Refer to the Goals and Philosophy section for detailed objectives.",
            },
            {
              question: "What are the various types of Virtual Labs?",
              answer:
                "The labs are primarily simulation-based or remote-triggered, allowing for diverse experimentation methods.",
            },
            {
              question: "Who are the intended users of the Virtual Labs?",
              answer:
                "Students, faculty, researchers, and educators in science and engineering disciplines.",
            },
            {
              question: "How can I access the Virtual Labs?",
              answer:
                "Virtual Labs can be accessed online via a web browser without any special software.",
            },
            {
              question: "Is it free to use?",
              answer: "Yes, Virtual Labs are free to use with no additional fees.",
            },
            {
              question: "What are the system configuration needed to run Workshops?",
              answer:
                "A stable internet connection and a modern web browser are sufficient for most workshops.",
            },
            {
              question:
                "Our college internet network has firewalls. Should any specific care be taken?",
              answer:
                "Ensure that the network allows access to vlabs.ac.in; you may need to coordinate with your IT department to whitelist the site.",
            },
            {
              question:
                "Does the Virtual Lab provide the LMS that the objectives mention?",
              answer:
                "Yes, Virtual Labs includes a Learning Management System with resources like video lectures and self-evaluation tools.",
            },
            {
              question: "How do I register for using the Virtual Labs?",
              answer:
                "Registration details can be found on the Virtual Labs website, typically requiring a simple sign-up process.",
            },
            {
              question:
                "I already have a Physical Lab in my college/institute. What benefit will Virtual Lab provide?",
              answer:
                "Virtual Labs complement physical labs by offering additional resources, simulations, and remote access to experiments.",
            },
            {
              question: "How does one derive the maximum benefit from Virtual Labs?",
              answer:
                "Engage with pretest and post-test features, explore all available resources, and use the simulations to prepare for real lab work.",
            },
            {
              question:
                "When I do an experiment how do I know if the experiment I did is done correctly?",
              answer:
                "Virtual Labs often include feedback mechanisms like post-tests and simulations that validate your experiment outcomes.",
            },
            {
              question: "How can a college conduct a Virtual Lab Workshop?",
              answer:
                "Colleges can coordinate with the Virtual Labs team to organize workshops, either on-site or online.",
            },
            {
              question: "Whom can I contact if I get stuck while using Virtual Labs?",
              answer:
                "Support contacts are available on the Virtual Labs website under the 'Contact Us' section.",
            },
            {
              question: "How can I contribute to the FAQ?",
              answer:
                "You can contribute by submitting questions or feedback through the Virtual Labs website.",
            },
            {
              question: "How can I contribute to Virtual Labs?",
              answer:
                "Contributions can be made by developing new labs, providing feedback, or joining as a nodal center; details are on the website.",
            },
          ].map((faq, index) => (
            <div key={index} className="border rounded-lg">
              <h3
                className="text-sm font-semibold text-blue-600 p-2 cursor-pointer flex justify-between items-center"
                onClick={() => toggleFaq(index)}
              >
                {`Q${index + 1}. ${faq.question}`}
                <span>{faqOpen[index] ? "−" : "+"}</span>
              </h3>
              {faqOpen[index] && <p className="text-sm p-2">{faq.answer}</p>}
            </div>
          ))}
        </div>
      ),
    },
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 overflow-y-auto overflow-x-auto h-[calc(100vh-0px)] ${
        isDarkMode ? "text-gray-100" : "text-gray-900"
      }`}
    >
      {/* Background */}
      {!onBack && (
        <div className="absolute inset-0 z-0">
          <ShaderBackground />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-2 py-6">
        {/* Overlay for better readability */}
        <div
          className={`absolute inset-0 z-0 ${
            isDarkMode ? "bg-black/50" : "bg-white/70"
          }`}
        ></div>
        <div className="relative z-10">
          {/* Back Button */}
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <ArrowLeft size={20} /> Back
            </button>
          </div>

          {/* Header */}
          <header
            className={`text-center py-12 rounded-xl ${
              isDarkMode ? "bg-gray-800/80" : "bg-white/80"
            } shadow-lg backdrop-blur-sm relative overflow-hidden`}
            style={{
              backgroundImage: "url('/virtual2.avif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
            }}
          >
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/30 z-0"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Virtual Labs
              </h1>
              <p
                className={`mt-2 text-sm md:text-base ${
                  isDarkMode ? "text-gray-300" : "text-gray-400"
                }`}
              >
                Empowering Learning Through Virtual Experimentation
              </p>
            </div>
          </header>

          {/* Tabs */}
          <div className="mt-6">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {Object.keys(tabContent).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div
              className={`p-4 rounded-xl shadow-md ${
                isDarkMode ? "bg-gray-800/80" : "bg-white/80"
              } transition-all duration-300 backdrop-blur-sm`}
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                {tabContent[activeTab].title}
              </h2>
              <div
                className={`text-sm leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {tabContent[activeTab].content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}