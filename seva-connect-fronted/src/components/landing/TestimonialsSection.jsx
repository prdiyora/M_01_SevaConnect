import React from "react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Volunteer",
      text: "SevaConnect helped me find meaningful work in my own city. The experience was life-changing!",
      avatar: "PS",
    },
    {
      id: 2,
      name: "Rahul Patel",
      role: "NGO Coordinator",
      text: "We connected with 200+ volunteers through SevaConnect. Incredible platform for social impact.",
      avatar: "RP",
    },
    {
      id: 3,
      name: "Anita Desai",
      role: "Volunteer",
      text: "I loved the volunteering experience. It's so easy to browse and join services near me.",
      avatar: "AD",
    },
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">What Our Volunteers Say</h2>
          <p className="section-subtitle">
            Real stories from real people making a real difference.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.id}>
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
