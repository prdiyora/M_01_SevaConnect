import React from "react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Join SevaConnect today and become part of a community that cares.
            Your small step can change someone's world.
          </p>
          <div className="cta-buttons">
            <button
              className="btn btn-white btn-lg"
              onClick={() => navigate("/register")}
            >
              🚀 Join Now — It's Free
            </button>
            <button
              className="btn btn-outline-white btn-lg"
              onClick={() => navigate("/contact")}
            >
              📞 Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
