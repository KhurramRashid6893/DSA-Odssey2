# DSA-Odssey2

DSA Odyssey: A 160-Day Journey Visualization
Welcome to DSA Odyssey, an interactive web application that visualizes a 160-day journey of solving Data Structures and Algorithms problems. Each problem is represented as a star in a navigable 3D galaxy. This project combines the power of 3D graphics with AI to create an engaging and educational experience.

https://dsa-odssey2.onrender.com

✨ Features
Interactive 3D Galaxy: Explore a beautiful, procedurally generated spiral galaxy built with Three.js. Each star represents a DSA problem solved during the 160-day journey.

Detailed Problem Insights: Click on any star (planet) to view detailed information, including the problem name, difficulty, topics covered, personal notes, and links to the problem statement.

AI-Powered Code Solutions: Integrated with the Google Gemini API, you can request and view code solutions for any problem in various programming languages (e.g., Python, C++, Java).

Search & Filter: Easily find specific problems by searching for their names or filtering the entire galaxy by topic.

Journey Path: Toggle a visual path that connects the stars in chronological order, showing the progression of the journey from Day 1 to Day 160.

Responsive Design: A mobile-first UI featuring a slide-in sidebar and a clean modal for code viewing ensures a seamless experience on any device.

🛠️ Tech Stack
Frontend:

HTML5, CSS3, JavaScript (ES6 Modules)

Three.js: For the 3D visualization and rendering.

Backend:

Python: Core backend language.

Flask: A lightweight web framework to serve the application and handle API requests.

AI Integration:

Google Gemini API: For generating code solutions on demand.

Deployment:

Gunicorn: As the Web Server Gateway Interface (WSGI) HTTP server.

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Python 3.8 or higher

pip (Python package installer)

A Google Gemini API Key

Installation & Setup
Clone the Repository

git clone [https://github.com/your-username/DSA-Odssey2.git](https://github.com/your-username/DSA-Odssey2.git)
cd DSA-Odssey2

Create a Virtual Environment
It's recommended to use a virtual environment to manage project dependencies.

# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

Install Dependencies
Install all the required Python packages from the requirements.txt file.

pip install -r requirements.txt

Set Up Environment Variables
You need to provide your Google Gemini API key. Create a file named .env in the root directory of the project and add your API key to it:

GEMINI_API_KEY="YOUR_API_KEY_HERE"

Note: The app.py file will need to be updated to load this environment variable instead of using a hardcoded key. This is a more secure practice.

Run the Flask Application
Once the setup is complete, you can run the application with the following command:

flask run

The application will be available at http://127.0.0.1:5000 in your web browser.

📂 Project Structure
.
├── app.py                  # Main Flask application file
├── Procfile                # Deployment configuration for services like Heroku
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css       # All custom styles for the application
│   ├── js/
│   │   └── main.js         # Core Three.js and frontend logic
│   └── journeyData.json    # Data for all 160 DSA problems
└── templates/
    └── index.html          # The main HTML file for the application

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

👤 Author
Khurram Rashid - Initial Work

Enjoy your journey through the DSA Odyssey! ✨
