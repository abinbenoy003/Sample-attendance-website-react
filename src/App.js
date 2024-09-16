import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [rollNumber, setRollNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDashboard,setIsDashboard] = useState(false);

  //Use effect fn  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(API_URL);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Handling roll number change events
  const handleRollNumberChange = (event) => {
    setRollNumber(event.target.value);
  };

  // Handling student name change events
  const handleStudentNameChange = (event) => {
    setStudentName(event.target.value);
  };

  // Handling email change events
  const handleEmailChange=(event)=>{
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange=(event)=>{
    setPhoneNumber(event.target.value);
  };


  // Handling checkin and checkout button clicks
  const handleCheckin = async (rollNumber) => {
    const updatedStudents = students.map((student) => {
      if (student.rollNumber === rollNumber) {
        return { ...student, checkinTime: new Date().toLocaleTimeString() };
      }
      return student;
    });

    try {
      const studentToUpdate = updatedStudents.find(
        (student) => student.rollNumber === rollNumber
      );
      await axios.put(`${API_URL}/${studentToUpdate.id}`, studentToUpdate);
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error updating checkin time:", error);
    }
  };

  //Handling checkout time
  const handleCheckout = async (rollNumber) => {
    const updatedStudents = students.map((student) => {
      if (student.rollNumber === rollNumber) {
        return { ...student, checkoutTime: new Date().toLocaleTimeString() };
      }
      return student;
    });

    try {
      const studentToUpdate = updatedStudents.find(
        (student) => student.rollNumber === rollNumber
      );
      await axios.put(`${API_URL}/${studentToUpdate.id}`, studentToUpdate);
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error updating checkout time:", error);
    }
  };


  // Handling add student button click
  const handleAddStudent = async () => {
    const newStudent = { rollNumber, name: studentName, email, phoneNumber};
    try {
      const response = await axios.post(API_URL, newStudent);
      setStudents([...students, response.data]);
      setRollNumber("");
      setStudentName("");
      setEmail("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const presentStudents = students.filter(
    (student) => student.checkoutTime === undefined
  );

  const handleDashboard =()=>{
    setIsDashboard(true);
  }




  return (
    <div className="container mx-auto p-8">
      <h1 className="flex text-2xl font-bold justify-center mb-4">Student Attendance System</h1>
      <nav className="flex justify-between px-10 py-5 border-b-2 border-black">
        <div>
          <p className='font-bold text-xl'>
            U  .<br/>S T</p>
        </div>
        <ul className='flex gap-5'>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a className='cursor-pointer' onClick={handleDashboard}>Dashboard</a>
          </li>
        </ul>
      </nav>
      {
        !isDashboard ?(
          <>
          <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="rollNumber"
        >
          Roll Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="rollNumber"
          type="number"
          value={rollNumber}
          onChange={handleRollNumberChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="studentName"
        >
          Student Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="studentName"
          type="text"
          value={studentName}
          onChange={handleStudentNameChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="phoneNumber"
        >
          Phone Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phoneNumber"
          type="text"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          required
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddStudent}
      >
        Add Student
      </button>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Students Present in School</h2>

        <p className="mb-4">Total students: {students.length}</p>
        <ul>
          {presentStudents.map((student) => (
            <li key={student.rollNumber} className="flex items-center">
              <div className="flex-grow">
                {student.name} (
                {student.checkinTime ? (
                  <>
                    Checked In: {student.checkinTime}{" "}
                    {student.checkoutTime && <span>- </span>}
                  </>
                ) : null}{" "}
                {student.checkoutTime && <>Checked Out: {student.checkoutTime}</>}
                {!student.checkinTime && !student.checkoutTime && (
                  <>Not checked in yet)</>
                )}
              </div>
              <div className="flex">
                <button
                  className="mt-4 ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleCheckin(student.rollNumber)}
                >
                  Check In
                </button>
                {student.checkinTime && !student.checkoutTime && (
                  <button
                    className="mt-4 ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleCheckout(student.rollNumber)}
                  >
                    Check Out
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      </>
        )
        :
        (
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p>Welcome to the dashboard</p>
            
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Roll Number</th>
                    <th scope="col" className="px-6 py-3">Student Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Phone Number</th>
                    <th scope="col" className="px-6 py-3">Check-in Time</th>
                    <th scope="col" className="px-6 py-3">Check-out Time</th>
                  </tr>
                
                {
                  students.map((student) => (
                    <tr key={student.rollNumber} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td>{student.rollNumber}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phoneNumber}</td>
                      <td>{student.checkinTime}</td>
                      <td>{student.checkoutTime}</td>
                    </tr>
                  ))
                }
                
                
              </table>
            </div>
          
        )
      }
    </div>
  );
}

export default App;