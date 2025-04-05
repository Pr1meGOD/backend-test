import React from "react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logos */}
      <header className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center">
          <img
            src="/somaiya-logo.png"
            alt="Somaiya Vidyavihar Logo"
            className="h-16 w-auto"
          />
        </div>
        <div>
          <img src="/somaiya-trust.png" alt="Somaiya Trust Logo" className="h-10 w-auto" />
        </div>
      </header>

      {/* Red bar */}
      <div className="h-8 bg-red-600"></div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Background image */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center "id="bg_image_unknown"></div>

        {/* Profile content */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-md w-full max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Profile</h1>
            <p className="text-gray-600 mb-8">Welcome to your student profile dashboard.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Name</label>
                  <div className="border-b-2 border-gray-300 pb-2">Atharva Deepak Manjrekar</div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Student ID</label>
                  <div className="border-b-2 border-gray-300 pb-2">242228125</div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Email</label>
                  <div className="border-b-2 border-gray-300 pb-2">atharvamanjrekar078@gmail.com</div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Branch</label>
                  <div className="border-b-2 border-gray-300 pb-2">IT</div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Academic Information</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Current Semester</label>
                  <div className="border-b-2 border-gray-300 pb-2">4</div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">CGPA</label>
                  <div className="border-b-2 border-gray-300 pb-2">8.75</div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Admission Year</label>
                  <div className="border-b-2 border-gray-300 pb-2">2022</div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Status</label>
                  <div className="border-b-2 border-gray-300 pb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Actions</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded">Edit Profile</button>
                <button className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded">Change Password</button>
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Log Out</button>
                <a
                  href="/dashboard"
                  className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded text-center"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
