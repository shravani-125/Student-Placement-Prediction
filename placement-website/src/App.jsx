import { useState } from "react";
import "./App.css";

function App() {

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    gender: "",
    tenth: "",
    twelfth: "",
    cgpa: "",
    backlogs: "",
    internship: "",
    technicalSkills: "",
    communicationSkills: "",
    projects: "",
    certifications: "",
    aptitudeScore: "",
  });

  // Prediction result
  const [result, setResult] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);


  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ============================================================
  // IMPROVEMENT SUGGESTIONS
  // ============================================================

  const getImprovements = () => {

    const improvements = [];

    // CGPA
    if (Number(formData.cgpa) < 7) {

      improvements.push({
        icon: "📚",
        title: "Academic Performance",
        message:
          "Try to improve your CGPA through regular study, revision and practice."
      });

    }


    // Technical Skills
    if (Number(formData.technicalSkills) < 8) {

      improvements.push({
        icon: "💻",
        title: "Technical Skills",
        message:
          "Improve your technical skills by learning technologies and building practical projects."
      });

    }


    // Communication Skills
    if (Number(formData.communicationSkills) < 8) {

      improvements.push({
        icon: "🗣️",
        title: "Communication Skills",
        message:
          "Practice English communication, presentations and mock interviews."
      });

    }


    // Projects
    if (Number(formData.projects) < 2) {

      improvements.push({
        icon: "🚀",
        title: "Projects",
        message:
          "Build more practical projects to strengthen your resume and development skills."
      });

    }


    // Certifications
    if (Number(formData.certifications) < 2) {

      improvements.push({
        icon: "🏆",
        title: "Certifications",
        message:
          "Complete relevant certifications to improve your technical profile."
      });

    }


    // Aptitude
    if (Number(formData.aptitudeScore) < 60) {

      improvements.push({
        icon: "📝",
        title: "Aptitude",
        message:
          "Practice quantitative aptitude, logical reasoning and problem-solving questions."
      });

    }


    // Backlogs
    if (Number(formData.backlogs) > 0) {

      improvements.push({
        icon: "📖",
        title: "Backlogs",
        message:
          "Focus on clearing your backlogs and maintaining a consistent academic record."
      });

    }


    // Internship
    if (Number(formData.internship) === 0) {

      improvements.push({
        icon: "💼",
        title: "Internship Experience",
        message:
          "Try to gain internship experience to improve practical knowledge and industry exposure."
      });

    }


    // If profile is strong
    if (improvements.length === 0) {

      improvements.push({
        icon: "🌟",
        title: "Great Profile",
        message:
          "Your current profile looks strong. Keep improving your skills and maintain your performance."
      });

    }


    return improvements;
  };


  // ============================================================
  // HANDLE FORM SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setResult(null);

    try {

      // ========================================================
      // CONVERT FRONTEND DATA INTO MODEL FORMAT
      // ========================================================

      const studentData = {

        // Male = 0
        // Female = 1
        Gender:
          formData.gender === "Male"
            ? 0
            : 1,

        "10th_Percentage":
          Number(formData.tenth),

        "12th_Percentage":
          Number(formData.twelfth),

        CGPA:
          Number(formData.cgpa),

        Backlogs:
          Number(formData.backlogs),

        Internship:
          Number(formData.internship),

        Technical_Skills:
          Number(formData.technicalSkills),

        Communication_Skills:
          Number(formData.communicationSkills),

        Projects:
          Number(formData.projects),

        Certifications:
          Number(formData.certifications),

        Aptitude_Score:
          Number(formData.aptitudeScore),
      };


      // ========================================================
      // SEND DATA TO FLASK BACKEND
      // ========================================================

      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(studentData),
        }
      );


      // ========================================================
      // GET BACKEND RESPONSE
      // ========================================================

      const data = await response.json();


      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Prediction failed"
        );

      }


      // ========================================================
      // SET RESULT
      // ========================================================

      setResult({

        status:
          data.prediction,

        message:
          `Placement Probability: ${data.placement_probability}%`,

        probability:
          data.placement_probability,

        notPlacedProbability:
          data.not_placed_probability,

        improvements:
          getImprovements(),

      });


    } catch (error) {

      console.error(
        "Prediction Error:",
        error
      );

      setResult({

        status: "Error",

        message:
          "Unable to connect with prediction server.",

        improvements: [],

      });

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="app">


      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            🎓
          </div>

          <div>

            <h2>
              PlacePredict
            </h2>

            <span>
              Student Placement System
            </span>

          </div>

        </div>


        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#predict">
            Predict
          </a>

          <a href="#about">
            About
          </a>

        </div>


        <a
          href="#predict"
          className="nav-button"
        >
          Get Started
        </a>

      </nav>



      {/* ======================================================
          HERO
      ====================================================== */}

      <section
        id="home"
        className="hero"
      >

        <div className="hero-left">

          <div className="hero-badge">
            ✨ AI Based Placement Prediction
          </div>


          <h1>

            Know Your

            <span>
              {" "}Placement{" "}
            </span>

            Potential

          </h1>


          <p>
            Analyze your academic performance,
            technical skills, communication skills
            and other factors to understand your
            placement possibility.
          </p>


          <div className="hero-buttons">

            <a
              href="#predict"
              className="primary-button"
            >
              Predict My Placement →
            </a>


            <a
              href="#about"
              className="secondary-button"
            >
              Learn More
            </a>

          </div>


          <div className="hero-stats">

            <div>

              <strong>
                1000+
              </strong>

              <span>
                Students
              </span>

            </div>


            <div>

              <strong>
                11
              </strong>

              <span>
                Features
              </span>

            </div>


            <div>

              <strong>
                89%
              </strong>

              <span>
                Model Accuracy
              </span>

            </div>

          </div>

        </div>



        {/* ==================================================
            HERO CARD
        ================================================== */}

        <div className="hero-right">

          <div className="prediction-card">

            <div className="card-top">

              <div className="round-icon">
                🎯
              </div>

              <div>

                <span>
                  PLACEMENT
                </span>

                <h3>
                  Prediction
                </h3>

              </div>

            </div>


            <div className="score-circle">

              <div>

                <strong>
                  89%
                </strong>

                <span>
                  Model Accuracy
                </span>

              </div>

            </div>


            <div className="mini-info">

              <div>

                <span>
                  📚
                </span>

                <p>
                  Academic
                </p>

              </div>


              <div>

                <span>
                  💻
                </span>

                <p>
                  Skills
                </p>

              </div>


              <div>

                <span>
                  🚀
                </span>

                <p>
                  Projects
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* ======================================================
          PREDICTION SECTION
      ====================================================== */}

      <section
        id="predict"
        className="predict-section"
      >

        <div className="section-title">

          <span>
            PLACEMENT ANALYSIS
          </span>

          <h2>
            Check Your Placement Potential
          </h2>

          <p>
            Enter your academic and professional
            details below.
          </p>

        </div>



        {/* ==================================================
            FORM
        ================================================== */}

        <form
          className="prediction-form"
          onSubmit={handleSubmit}
        >


          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="form-heading">

            <div className="heading-number">
              01
            </div>

            <div>

              <h3>
                Personal Information
              </h3>

              <p>
                Basic student information
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* Gender */}

            <div className="input-box">

              <label>
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

              </select>

            </div>


            {/* Internship */}

            <div className="input-box">

              <label>
                Internship Experience
              </label>

              <select
                name="internship"
                value={formData.internship}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Option
                </option>

                <option value="1">
                  Yes
                </option>

                <option value="0">
                  No
                </option>

              </select>

            </div>

          </div>



          {/* =================================================
              ACADEMIC INFORMATION
          ================================================= */}

          <div className="form-heading">

            <div className="heading-number">
              02
            </div>

            <div>

              <h3>
                Academic Performance
              </h3>

              <p>
                Your academic information
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* 10th */}

            <div className="input-box">

              <label>
                10th Percentage
              </label>

              <input
                type="number"
                name="tenth"
                placeholder="Example: 85"
                min="0"
                max="100"
                step="0.01"
                value={formData.tenth}
                onChange={handleChange}
                required
              />

            </div>


            {/* 12th */}

            <div className="input-box">

              <label>
                12th Percentage
              </label>

              <input
                type="number"
                name="twelfth"
                placeholder="Example: 82"
                min="0"
                max="100"
                step="0.01"
                value={formData.twelfth}
                onChange={handleChange}
                required
              />

            </div>


            {/* CGPA */}

            <div className="input-box">

              <label>
                Current CGPA
              </label>

              <input
                type="number"
                name="cgpa"
                placeholder="Example: 8.5"
                min="0"
                max="10"
                step="0.01"
                value={formData.cgpa}
                onChange={handleChange}
                required
              />

            </div>


            {/* Backlogs */}

            <div className="input-box">

              <label>
                Number of Backlogs
              </label>

              <input
                type="number"
                name="backlogs"
                placeholder="Example: 0"
                min="0"
                value={formData.backlogs}
                onChange={handleChange}
                required
              />

            </div>

          </div>



          {/* =================================================
              SKILLS & ACHIEVEMENTS
          ================================================= */}

          <div className="form-heading">

            <div className="heading-number">
              03
            </div>

            <div>

              <h3>
                Skills & Achievements
              </h3>

              <p>
                Tell us about your skills and activities
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* Technical Skills */}

            <div className="input-box">

              <label>
                Technical Skills
              </label>

              <select
                name="technicalSkills"
                value={formData.technicalSkills}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Level
                </option>

                <option value="4">
                  Beginner
                </option>

                <option value="6">
                  Average
                </option>

                <option value="8">
                  Good
                </option>

                <option value="10">
                  Excellent
                </option>

              </select>

            </div>


            {/* Communication Skills */}

            <div className="input-box">

              <label>
                Communication Skills
              </label>

              <select
                name="communicationSkills"
                value={formData.communicationSkills}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Level
                </option>

                <option value="4">
                  Beginner
                </option>

                <option value="6">
                  Average
                </option>

                <option value="8">
                  Good
                </option>

                <option value="10">
                  Excellent
                </option>

              </select>

            </div>


            {/* Projects */}

            <div className="input-box">

              <label>
                Projects
              </label>

              <input
                type="number"
                name="projects"
                placeholder="Example: 3"
                min="0"
                value={formData.projects}
                onChange={handleChange}
                required
              />

            </div>


            {/* Certifications */}

            <div className="input-box">

              <label>
                Certifications
              </label>

              <input
                type="number"
                name="certifications"
                placeholder="Example: 2"
                min="0"
                value={formData.certifications}
                onChange={handleChange}
                required
              />

            </div>


            {/* Aptitude */}

            <div className="input-box">

              <label>
                Aptitude Score
              </label>

              <input
                type="number"
                name="aptitudeScore"
                placeholder="Example: 75"
                min="0"
                max="100"
                value={formData.aptitudeScore}
                onChange={handleChange}
                required
              />

            </div>

          </div>



          {/* =================================================
              PREDICT BUTTON
          ================================================= */}

          <button
            type="submit"
            className="predict-button"
            disabled={loading}
          >

            {loading
              ? "🔄 Predicting..."
              : "🔮 Predict My Placement"}

          </button>


          <p className="form-note">
            🔒 Your information is used only for placement prediction.
          </p>

        </form>



        {/* ==================================================
            RESULT CARD
        ================================================== */}

        {result && (

          <div className="result-card">

            <div className="result-icon">

              {result.status === "Placed"
                ? "✓"
                : result.status === "Not Placed"
                ? "!"
                : "⚠"}

            </div>


            <div className="result-content">

              <span>
                PREDICTION STATUS
              </span>


              <h3>
                {result.status}
              </h3>


              <p>
                {result.message}
              </p>


              {result.probability !== undefined && (

                <p>
                  Not Placed Probability:{" "}
                  {result.notPlacedProbability}%
                </p>

              )}



              {/* =================================================
                  IMPROVEMENT SECTION
              ================================================= */}

              {result.status !== "Error" &&
                result.improvements &&
                result.improvements.length > 0 && (

                <div className="improvement-section">

                  <h4>
                    💡 Areas for Improvement
                  </h4>


                  <div className="improvement-list">

                    {result.improvements.map(
                      (item, index) => (

                      <div
                        className="improvement-item"
                        key={index}
                      >

                        <div className="improvement-icon">
                          {item.icon}
                        </div>


                        <div>

                          <strong>
                            {item.title}
                          </strong>

                          <p>
                            {item.message}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>

          </div>

        )}

      </section>



      {/* ======================================================
          ABOUT SECTION
      ====================================================== */}

      <section
        id="about"
        className="about-section"
      >

        <div className="section-title">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            Simple. Smart. Fast.
          </h2>

          <p>
            Our system uses machine learning to analyze
            important student placement factors.
          </p>

        </div>


        <div className="steps">


          {/* Step 1 */}

          <div className="step-card">

            <div className="step-icon">
              📝
            </div>

            <span>
              01
            </span>

            <h3>
              Enter Details
            </h3>

            <p>
              Provide your academic performance,
              skills and achievements.
            </p>

          </div>



          {/* Step 2 */}

          <div className="step-card">

            <div className="step-icon">
              🤖
            </div>

            <span>
              02
            </span>

            <h3>
              ML Analysis
            </h3>

            <p>
              Our trained machine learning model
              analyzes your profile.
            </p>

          </div>



          {/* Step 3 */}

          <div className="step-card">

            <div className="step-icon">
              🎯
            </div>

            <span>
              03
            </span>

            <h3>
              Get Prediction
            </h3>

            <p>
              Receive your predicted placement
              status instantly.
            </p>

          </div>

        </div>

      </section>



      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer>

        <div>

          <h3>
            🎓 PlacePredict
          </h3>

          <p>
            Student Placement Prediction System
          </p>

        </div>


        <p>
          © 2026 PlacePredict. Mini Project.
        </p>

      </footer>

    </div>
  );
}

export default App;