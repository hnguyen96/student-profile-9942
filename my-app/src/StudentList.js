import React, { useState, useEffect  } from 'react';
import axios from 'axios';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  // const [filteredStudents, setFilteredStudents] = useState([]);

  //Fetch students from API
  useEffect(() => {
    axios.get(`https://api.hatchways.io/assessment/students`)
    .then(res => {
        const students = res.data.students;
        setStudents(students);
      });
  }, []);

  // const setSearchInput = (value) =>{
  //   setSearch(value);
  //   if(search !== ""){
  //     const filter = students.filter(student => {
  //       return student.lastName.toLowerCase().includes(search.toLowerCase());
  //     });
  //
  //     console.log(filter);
  //     setFilteredStudents(filter);
  //   } else{
  //     setFilteredStudents(students);
  //   }
  // }

  //Calculate average score
  function avg(grades){
    var sum = 0;
    for(let i = 0; i < grades.length; i++ ){
        sum += parseInt(grades[i]);
    }
    var avg = sum/grades.length;

    return avg;
  }

  //Display each student properties
  const studentRows = students
      // eslint-disable-next-line
      .filter((student) => {
        if(searchInput !== ""){
          let fullName = student.firstName + student.lastName;

          if (fullName.toLowerCase().includes(searchInput.toLowerCase())){
            return student;
          }
        } else {
          return student;
        }
      })
      .map((student) =>
        <div className="row border-bottom pt-3 pb-3" key={student.id}>
            <div className="col-3 ps-1">
              <img src={student.pic} className="rounded-circle border border-dark mx-auto d-block w-75" alt="Student pic" />
            </div>
            <div className="col-8">
              <h1 className="name row text-uppercase">{student.firstName} {student.lastName}</h1>
              <div className="row ps-3">
                <div className="row">Email: {student.email}</div>
                <div className="row">Company: {student.company}</div>
                <div className="row">Skill: {student.skill}</div>
                <div className="row">Average: {avg(student.grades)}%</div>
                <div className="collapse pt-2" id={student.id}>
                    {student.grades.map((grade, index) =>
                      <div key={index} className="row">{"Test " + (index + 1) + ": " + grade}</div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-1">
              <button className="btn btn-light" type="button" data-toggle="collapse" data-target={"#" + student.id} aria-expanded="false" aria-controls="collapseExample">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </button>
            </div>
        </div>
      );

    return (
      <div className="wrapper">
        <div className="students rounded border border-dark position-absolute">
          <input type="text" className="form-control sticky-top border-0 border-bottom" id="search" placeholder="Search by name" value={searchInput} required onChange={e => setSearchInput( e.target.value )}/>
          {studentRows}
        </div>
      </div>
    );
};

export default StudentList;
