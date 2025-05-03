'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function AboutSection() {
  const router = useRouter();

  const handleReturn = () => {
    router.back(); // Takes user to the previous page
  };

  return (
    <main>
      <div className="about-container" id="aboutSection">
        <div className="headmessage">
          <h2>About Computer Science at Qatar University</h2>
          <p>
            The Computer Science program at Qatar University provides students with the knowledge and skills needed for a successful career in computing. The program covers topics such as artificial intelligence, cybersecurity, software engineering, and data science. It is designed to meet international standards and prepares graduates for both industry and research.
          </p>
        </div>

        <div className="instructors-grid">
          <div className="card2">
            <h3>Dr. Mahmoud Barhamgi</h3>
            <p>Associate Professor in Computer Science</p>
            <p>Teaches: Web Development</p>
            <img
              src="https://www.qu.edu.qa/SiteImages/static_file/qu/colleges/engineering/departments/cse/images/Mahmoud_Barhamgi.png?csf=1&e=9RvgKr"
              alt="Dr. Mahmoud Barhamgi"
            />
          </div>

          <div className="card2">
            <h3>Mr. Abdulahi Mohammed</h3>
            <p>Bch in web dev</p>
            <p>Teaches: Web Development</p>
            <img
              src="https://media.licdn.com/dms/image/v2/C4E03AQHVRLl5K0Z0yw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1523661783694?e=2147483647&v=beta&t=OwyfGzLYWmxXxvIAnf4an_TK3KiHXjfdD-A58Cp2u44"
              alt="Mr. Abdulahi Mohammed"
            />
          </div>
        </div>

        <button onClick={handleReturn} className="return-button">
          ← Return
        </button>
      </div>
    </main>
  );
}
